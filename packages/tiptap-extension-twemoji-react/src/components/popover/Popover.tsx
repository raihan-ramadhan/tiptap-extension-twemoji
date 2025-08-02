import { cloneElement, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Components
import { Alignment, Placement, Side } from "@floating-ui/dom";

// Configs
import {
  sharedAutoUpdatePosition,
  setupDismissListeners,
  customComputePosition,
  floatingStyles,
} from "./config";

import { mergeRefs } from "@/lib/emoji-grid-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";

export function Popover({
  children,
  trigger,
  open,
  onOpenChange,
  overlay = false,
  align,
  side,
  fallback,
  trapRef,
  tooltipForTrigger = false,
  triggerLabel,
}: {
  children: React.ReactNode;
  trigger: React.ReactElement<any, any>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overlay?: boolean;
  side?: Side;
  align?: Alignment | "center";
  fallback?: Placement[];
  trapRef?: React.RefObject<HTMLDivElement | null>;
  tooltipForTrigger?: boolean;
  triggerLabel?: string;
}) {
  const referenceRef = useRef<HTMLButtonElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  /**
   * gives the initial and ongoing positioning while the Popover is open
   * removes/cleans up the auto-update logic
   */
  useEffect(() => {
    if (!open || !referenceRef.current || !floatingRef.current) return;

    const cleanup = sharedAutoUpdatePosition({
      reference: referenceRef.current,
      floating: floatingRef.current,
      update: () => {
        customComputePosition(referenceRef.current!, floatingRef.current!, {
          align,
          side,
          fallback,
        });
      },
    });

    return cleanup;
  }, [open]);

  // events listener
  useEffect(() => {
    if (!open) return;
    const cleanup = setupDismissListeners({
      safeElements: [referenceRef.current, floatingRef.current],
      onCancel: () => onOpenChange(false),
    });

    return cleanup;
  }, [open, onOpenChange]);

  const content = (
    <div ref={mergeRefs(floatingRef, trapRef)} style={floatingStyles.base}>
      {children}
    </div>
  );

  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Store focus before the popover opens
    prevFocusRef.current = document.activeElement as HTMLElement;

    return () => {
      requestAnimationFrame(() => {
        prevFocusRef.current?.focus();
      });
    };
  }, []);

  const sharedProps = {
    ...trigger.props,
    ref: mergeRefs(referenceRef, trigger.props.ref),
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      trigger.props.onClick?.(event);
      onOpenChange(!open);
      requestAnimationFrame(() => {
        prevFocusRef.current?.focus();
      });
    },
  };

  let finalTrigger = trigger;

  if (tooltipForTrigger) {
    finalTrigger = (
      <Tooltip>
        <TooltipTrigger {...sharedProps}>
          {trigger.props.children}
        </TooltipTrigger>
        <TooltipContent>
          <span>{triggerLabel}</span>
        </TooltipContent>
      </Tooltip>
    );
  } else {
    finalTrigger = cloneElement(trigger, sharedProps);
  }

  return (
    <>
      {finalTrigger}

      {open ? (
        <>
          {createPortal(
            overlay ? (
              <div
                data-overlay-popover
                style={floatingStyles.overlay}
                onPointerDown={(e) => {
                  if (e.target === e.currentTarget) {
                    onOpenChange(false);
                  }
                }}
              >
                {content}
              </div>
            ) : (
              content
            ),
            document.body
          )}
        </>
      ) : null}
    </>
  );
}
