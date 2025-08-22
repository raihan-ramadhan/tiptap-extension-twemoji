import { memo, useEffect, useRef, useState } from "react";
import { createFocusTrap } from "focus-trap";
import Content from "./Content";
import { Popover } from "@/components/popover/Popover";
import { Alignment, Placement, Side } from "@floating-ui/dom";
import { DropzoneUploadProps } from "@/types";

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
  onErrorUpload: DropzoneUploadProps["onError"];
} & React.ComponentProps<"button"> &
  Omit<DropzoneUploadProps, "onError">;

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
  accept,
  maxSize,
  interceptAddCustomEmojiClick,
  disabledAddCustomEmoji,
  ...props
}: AddCustomEmojiProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const subTrapRef = useRef<HTMLDivElement | null>(null);
  const focusTrap = useRef<ReturnType<typeof createFocusTrap> | null>(null);

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
      trigger={
        <button
          {...props}
          onClick={() => {
            if (interceptAddCustomEmojiClick) {
              return typeof interceptAddCustomEmojiClick == "function"
                ? interceptAddCustomEmojiClick()
                : interceptAddCustomEmojiClick;
            }
          }}
          disabled={disabledAddCustomEmoji}
        >
          {children}
        </button>
      }
      trapRef={subTrapRef}
      triggerLabel={label}
      tooltipForTrigger
    >
      <Content
        focusTrap={focusTrap}
        subTrapRef={subTrapRef}
        maxSize={maxSize}
        accept={accept}
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
