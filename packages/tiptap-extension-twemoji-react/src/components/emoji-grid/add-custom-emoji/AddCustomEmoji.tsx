import { memo, useEffect, useRef, useState } from "react";
import { createFocusTrap } from "focus-trap";
import Content from "./Content";
import { Popover } from "@/components/popover/Popover";
import { Alignment, Side } from "@floating-ui/dom";
import { DropzoneUploadProps } from "@/types";

type AddCustomEmojiProps = {
  onSubPopoverMount: () => void;
  onSubPopoverUnmount: () => void;
  onMount?: () => void;
  onUnmount?: () => void;
  side?: Side;
  align?: Alignment | "center";
  children?: React.ReactElement;
  label?: string;
  navigationCellDisableOnMount?: boolean;
  onErrorUpload: DropzoneUploadProps["onError"];
  onCancel?: () => void;
} & React.ComponentProps<"button"> &
  Omit<DropzoneUploadProps, "onError">;

const AddCustomEmoji = ({
  onSubPopoverUnmount,
  onSubPopoverMount,
  onErrorUpload,
  onSuccess,
  onUnmount,
  children,
  onMount,
  upload,
  align,
  label = "Add Emoji",
  side,
  accept,
  maxSize,
  interceptAddEmojiClick,
  disabledAddCustomEmoji,
  onCancel,
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
      trigger={
        <button
          {...props}
          onClick={async () => {
            if (typeof interceptAddEmojiClick === "boolean") {
              return interceptAddEmojiClick;
            }

            if (typeof interceptAddEmojiClick === "function") {
              return await interceptAddEmojiClick(onCancel);
            }

            return false; // fallback
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
