import { cloneElement, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  customComputePosition,
  floatingStyles,
  sharedAutoUpdatePosition,
  setupDismissListeners,
} from "./config";
import { Alignment, Placement, Side } from "@floating-ui/dom";

export function Popover({
  children,
  trigger,
  open,
  onOpenChange,
  overlay = false,
  align,
  side,
  fallback,
}: {
  children: React.ReactNode;
  trigger: React.ReactElement<any, any>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overlay?: boolean;
  side?: Side;
  align?: Alignment | "center";
  fallback?: Placement[];
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

  // Outside click
  useEffect(() => {
    if (!open) return;

    const cleanup = setupDismissListeners({
      safeElements: [referenceRef.current, floatingRef.current],
      onCancel: () => onOpenChange(false),
    });

    return cleanup;
  }, [open, onOpenChange]);

  const content = (
    <div ref={floatingRef} style={floatingStyles.base}>
      {children}
    </div>
  );

  return (
    <>
      {cloneElement(trigger, {
        ref: referenceRef,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          trigger.props.onClick?.(event);
          onOpenChange(!open);
        },
      })}

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
