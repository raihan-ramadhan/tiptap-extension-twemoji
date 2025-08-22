import { CSSProperties } from "react";

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
import { ReactRenderer } from "@tiptap/react";

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
    background: "var(--twemoji-background)" as string,
    color: "var(--twemoji-foreground)" as string,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "var(--twemoji-rounded-parent)" as string,
    minHeight: "32px",
    width: "fit-content",
    height: "fit-content",
    overflow: "auto",
    border: "1px solid var(--twemoji-border-color)" as string,
  },
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
    pointerEvents: "auto",
  },
};

export const destroyPopoverComponent = (
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

export function attachAutoUpdate(
  triggerEl: Element | null,
  popoverEl: HTMLDivElement,
  options: {
    side?: Side;
    align?: Alignment | "center";
    fallback?: Placement[];
    boundary?: Boundary | undefined;
  } = {}
) {
  if (!triggerEl) return;

  const {
    align = "start",
    side = "bottom",
    fallback = ["right-start", "bottom", "left-start", "bottom-start"],
    boundary = document.body,
  } = options;

  // cleanup fn from autoUpdate
  const cleanup = autoUpdate(triggerEl, popoverEl, () => {
    computePosition(triggerEl, popoverEl, {
      placement: buildPlacement(side, align),
      middleware: floatingMiddleware(fallback, boundary),
    }).then(({ x, y, strategy }) => {
      Object.assign(popoverEl.style, floatingStyles.base, {
        position: strategy,
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  });

  return cleanup; // call this when closing popover
}

export function attachIntersectionObserver(
  triggerEl: Element | null,
  onCancel: () => void
) {
  if (!triggerEl) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      onCancel();
    }
  });

  observer.observe(triggerEl);

  return () => {
    observer.disconnect();
  };
}

export function attachPointerDownListener(
  safeElements: (HTMLElement | null | undefined)[],
  onCancel: () => void
) {
  // Click outside logic
  const handleClickOutside = (event: MouseEvent) => {
    const path = event.composedPath();
    const clickedInside = path.some(
      (node) =>
        node instanceof HTMLElement &&
        (node.hasAttribute("data-overlay-popover") ||
          safeElements.some((el) => el?.contains(node)))
    );

    if (!clickedInside) {
      onCancel();
    }
  };

  document.addEventListener("pointerdown", handleClickOutside);

  // Cleanup function when popover unmounts or closes
  return () => {
    document.removeEventListener("pointerdown", handleClickOutside);
  };
}
