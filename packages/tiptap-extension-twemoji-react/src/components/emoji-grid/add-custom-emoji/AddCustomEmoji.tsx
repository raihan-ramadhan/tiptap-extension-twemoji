import { memo, useEffect, useRef, useState } from "react";
import Content from "./Content";
import { Popover } from "@/components/popover/Popover";
import { Alignment, Placement, Side } from "@floating-ui/dom";
import { ExtensionOptions } from "@/types";
import { createFocusTrap } from "focus-trap";

type Props = {
  onMount: () => void;
  onUnmount: () => void;
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
  onUnmount,
  onMount,
  align,
  side,
  fallback,
  children,
  upload,
  onSuccess,
  onErrorUpload,
  label = "Add Emoji",
  navigationCellDisableOnMount = false,
  ...props
}: Props) => {
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
    if (navigationCellDisableOnMount) {
      onMount();

      return () => {
        onUnmount();
      };
    }
  }, [navigationCellDisableOnMount]);

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
        onMount={onMount}
        onUnmount={onUnmount}
        setIsOpen={setIsOpen}
        onError={onErrorUpload}
        onSuccess={onSuccess}
        upload={upload}
      />
    </Popover>
  );
};

export default memo(AddCustomEmoji);
