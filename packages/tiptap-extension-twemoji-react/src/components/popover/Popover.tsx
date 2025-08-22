import { cloneElement, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Components
import { Alignment, Placement, Side } from "@floating-ui/dom";

// Configs
import {
  floatingStyles,
  attachAutoUpdate,
  attachPointerDownListener,
  attachIntersectionObserver,
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

  const content = (
    <div
      ref={mergeRefs(trapRef, floatingRef)}
      style={floatingStyles.base}
      tabIndex={-1}
    >
      {children}
    </div>
  );

  const sharedProps = {
    ...trigger.props,
    ref: mergeRefs(referenceRef, trigger.props.ref),
    onClick: () => {
      const shouldContinue = trigger.props.onClick?.();
      // if the onClick returns true, stop the rest
      if (shouldContinue === true) return;

      onOpenChange(!open);
      requestAnimationFrame(() => {
        referenceRef.current?.focus();
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

  /**
   * gives the initial and ongoing positioning while the Popover is open
   * removes/cleans up the auto-update logic
   */

  useEffect(() => {
    if (!open || !referenceRef.current || !floatingRef.current) return;
    const cleanup = attachAutoUpdate(
      referenceRef.current,
      floatingRef.current,
      {
        align,
        side,
        fallback,
      }
    );

    return cleanup;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const cleanup = attachPointerDownListener(
      [referenceRef.current, floatingRef.current],
      () => onOpenChange(false)
    );

    return cleanup;
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!referenceRef.current) return;

    const cleanup = attachIntersectionObserver(referenceRef.current, () => {
      onOpenChange(false);
    });

    return cleanup;
  }, [referenceRef, onOpenChange]);

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
                    requestAnimationFrame(() => {
                      if (referenceRef.current) {
                        referenceRef.current.focus();
                      }
                    });
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
