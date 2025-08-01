import { CSSProperties } from "react";

export type VirtualElement = {
  getBoundingClientRect: () => DOMRect;
};

import {
  offset,
  flip,
  shift,
  Middleware,
  computePosition,
  Placement,
  Alignment,
  Side,
  autoUpdate,
  Boundary,
} from "@floating-ui/dom";
import { Editor, posToDOMRect, ReactRenderer } from "@tiptap/react";

// Define a reusable type for inline style objects
interface StyleMap extends Partial<CSSProperties> {
  [key: string]: string | number | undefined;
}

export const floatingStyles: {
  base: StyleMap;
  overlay: StyleMap;
} = {
  base: {
    position: "absolute" as const,
    top: "0",
    left: "0",
    zIndex: 9999,
    background: "white",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    minHeight: "32px",
    width: "fit-content",
    height: "fit-content",
    overflow: "auto",
    border: "1px solid rgba(30,30,30)",
  },
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
    pointerEvents: "auto",
  },
};

export const destroyVirtualElement = (
  component: ReactRenderer<unknown, object> | null
) => {
  // close the tooltip menu emoji list
  component?.destroy();
  // remove the parent node
  if (component?.element?.parentNode) {
    component.element.parentNode.removeChild(component.element);
  }
};

export const floatingMiddleware: (
  fallbackPlacements?: Placement[] | undefined,
  boundary?: Boundary | undefined
) => Middleware[] = (fallbackPlacements, boundary) => [
  offset(4),
  flip({
    boundary,
    fallbackPlacements,
  }),
  shift({
    boundary,
  }),
];

/**
 * Why return only side for center?
 * Because @floating-ui treats "bottom" as centered already:
 * "bottom" = same as "bottom-center"
 * So "bottom-center" is invalid — it should just be "bottom".
 */
function buildPlacement(side: Side, align?: Alignment | "center"): Placement {
  if (align === "center") {
    return side;
  }

  return `${side}-${align}` as Placement;
}

export const watchPopoverVisibility = (rect: DOMRect, element: Element) => {
  const wrapperRect = element.getBoundingClientRect();
  return (
    rect.top >= wrapperRect.top &&
    rect.bottom <= wrapperRect.bottom &&
    rect.left >= wrapperRect.left &&
    rect.right <= wrapperRect.right
  );
};

export const getVirtualElement = (editor: Editor) => {
  return {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to
      ),
  };
};

export const customComputePosition = (
  reference: HTMLElement | VirtualElement,
  element: HTMLDivElement,
  options: {
    side?: Side;
    align?: Alignment | "center";
    fallback?: Placement[];
    boundary?: Boundary | undefined;
  } = {}
) => {
  const {
    align = "start",
    side = "bottom",
    fallback = ["right-start", "bottom", "left-start", "bottom-start"],
    boundary = document.body,
  } = options;

  computePosition(reference, element, {
    placement: buildPlacement(side, align),
    middleware: floatingMiddleware(fallback, boundary),
  }).then(({ x, y, strategy }) => {
    Object.assign(element.style, floatingStyles.base, {
      position: strategy,
      left: `${x}px`,
      top: `${y}px`,
    });
  });
};

export const updatePosition = (
  virtualElement: VirtualElement,
  element: HTMLDivElement,
  onCancel: () => void,
  wrapper: Element | null
) => {
  if (!wrapper) return;

  const referenceElementRect: DOMRect = virtualElement.getBoundingClientRect();

  const isVisible = watchPopoverVisibility(referenceElementRect, wrapper);

  if (!isVisible) {
    onCancel(); // ❌ Hide the component if not visible
    return;
  }

  customComputePosition(virtualElement, element, {
    align: "start",
    side: "bottom",
  });
};

export const eventsHooks = ({
  popoverComponent,
  virtualElement,
  onCancel,
  wrapper,
  editor,
}: {
  popoverComponent: HTMLDivElement;
  virtualElement: VirtualElement;
  onCancel: () => void;
  editor: Editor;
  wrapper: Element | null;
}) => {
  if (!wrapper) return;

  const updateHandler = () => {
    updatePosition(virtualElement, popoverComponent, onCancel, wrapper);
  };

  wrapper.addEventListener("scroll", updateHandler);

  const cleanupClick = setupDismissListeners({
    safeElements: [popoverComponent, editor.view.dom],
    onCancel,
  });

  const cleanupFloating = sharedAutoUpdatePosition({
    reference: virtualElement,
    floating: popoverComponent,
    update: updateHandler,
  });

  // ✅ cleanup everything later
  return () => {
    cleanupFloating();
    cleanupClick();
    wrapper.removeEventListener("scroll", updateHandler);
  };
};

type OutsideClickHandlerOptions = {
  safeElements: (HTMLElement | null | undefined)[];
  onCancel: () => void;
};

export function setupDismissListeners({
  safeElements,
  onCancel,
}: OutsideClickHandlerOptions): () => void {
  const handleClickOutside = (event: MouseEvent) => {
    const path = event.composedPath();

    const clickedInside = path.some((node) => {
      return (
        node instanceof HTMLElement &&
        (node.hasAttribute("data-overlay-popover") ||
          safeElements.some((el) => el?.contains(node)))
      );
    });

    if (!clickedInside) {
      onCancel();
    }
  };

  const handleOnKeyDown = (e: globalThis.KeyboardEvent): void => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onCancel();
    }
  };

  document.addEventListener("pointerdown", handleClickOutside);
  document.addEventListener("keydown", handleOnKeyDown);

  // Return cleanup function
  return () => {
    document.removeEventListener("pointerdown", handleClickOutside);
    document.removeEventListener("keydown", handleOnKeyDown);
  };
}

type AutoUpdateOptions = {
  reference: HTMLElement | VirtualElement | null;
  floating: HTMLElement | null;
  update: () => void;
};

/**
 * Shared utility to handle autoUpdate lifecycle for both real and virtual elements.
 * Cleans up automatically when no longer needed.
 */
export function sharedAutoUpdatePosition({
  reference,
  floating,
  update,
}: AutoUpdateOptions): () => void {
  if (!reference || !floating) return () => {};

  const cleanup = autoUpdate(reference, floating, update);
  return cleanup;
}
