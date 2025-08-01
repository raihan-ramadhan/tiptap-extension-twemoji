import {
  cloneElement,
  isValidElement,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
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
  asChild?: boolean;
  children?: React.ReactElement;
} & React.ComponentProps<"button"> &
  Omit<ExtensionOptions, "onError"> & {
    onErrorUpload?: ExtensionOptions["onError"];
  };

const AddEmojiBtnWrapper = ({
  onUnmount,
  onMount,
  align,
  side,
  fallback,
  asChild,
  children,
  upload,
  onSuccess,
  onErrorUpload,
  ...props
}: Props) => {
  const triggerElement =
    asChild && isValidElement(children) ? (
      cloneElement(children, { ...props })
    ) : (
      <button {...props}>{children}</button>
    );

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

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      align={align}
      side={side}
      overlay
      fallback={fallback}
      trigger={triggerElement}
      trapRef={trapRef}
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

export default memo(AddEmojiBtnWrapper);
