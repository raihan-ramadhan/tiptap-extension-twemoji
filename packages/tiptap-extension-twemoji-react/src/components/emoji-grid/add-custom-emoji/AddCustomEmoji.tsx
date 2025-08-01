import { memo, useEffect, useRef, useState } from "react";
import { createFocusTrap } from "focus-trap";
import Content from "./Content";
import { Popover } from "@/components/popover/Popover";
import { Alignment, Placement, Side } from "@floating-ui/dom";
import { ExtensionOptions } from "@/types";

type AddCustomEmojiProps = {
  onSubPopoverMount: () => void;
  onSubPopoverUnmount: () => void;
  onMount?: () => void;
  onUnmount?: () => void;
  side?: Side;
  align?: Alignment | "center";
  fallback?: Placement[];
  children?: React.ReactElement;
  label?: string;
  navigationCellDisableOnMount?: boolean;
} & React.ComponentProps<"button"> &
  Omit<ExtensionOptions, "onError"> & {
    onErrorUpload?: ExtensionOptions["onError"];
  };

const AddCustomEmoji = ({
  onSubPopoverUnmount,
  onSubPopoverMount,
  onErrorUpload,
  onSuccess,
  onUnmount,
  fallback,
  children,
  onMount,
  upload,
  align,
  label = "Add Emoji",
  side,
  ...props
}: AddCustomEmojiProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const trapRef = useRef<HTMLDivElement | null>(null);
  const focusTrap = useRef<ReturnType<typeof createFocusTrap> | null>(null);

  useEffect(() => {
    if (isOpen && trapRef.current) {
      focusTrap.current = createFocusTrap(trapRef.current, {
        escapeDeactivates: false,
        clickOutsideDeactivates: true,
        returnFocusOnDeactivate: true,
      });

      // Immediately activate trap
      focusTrap.current.activate();
    }

    return () => {
      focusTrap.current?.deactivate();
      focusTrap.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    if (onMount) onMount();

    return () => {
      if (onUnmount) onUnmount();
    };
  }, [onMount, onUnmount]);

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      align={align}
      side={side}
      overlay
      fallback={fallback}
      trigger={<button {...props}>{children}</button>}
      trapRef={trapRef}
      triggerLabel={label}
      tooltipForTrigger
    >
      <Content
        onUnmount={onSubPopoverUnmount}
        onMount={onSubPopoverMount}
        onError={onErrorUpload}
        onSuccess={onSuccess}
        setIsOpen={setIsOpen}
        upload={upload}
      />
    </Popover>
  );
};

export default memo(AddCustomEmoji);
