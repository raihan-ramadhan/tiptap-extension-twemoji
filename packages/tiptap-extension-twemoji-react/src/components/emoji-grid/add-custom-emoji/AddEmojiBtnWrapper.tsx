import { cloneElement, isValidElement, useState } from "react";
import Content from "./Content";
import { Popover } from "@/components/popover/Popover";
import { Alignment, Placement, Side } from "@floating-ui/dom";
import { ExtensionOptions } from "@/types";

type Props = {
  onMount: () => void;
  onUnmount: () => void;
  side?: Side;
  align?: Alignment | "center";
  fallback?: Placement[];
  asChild?: boolean;
  children?: React.ReactElement;
} & React.HTMLAttributes<HTMLElement> &
  ExtensionOptions;

const AddEmojiBtnWrapper = ({
  onUnmount,
  onMount,
  align,
  side,
  fallback,
  asChild,
  children,
  upload,
  onSuccessUpload,
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
  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      align={align}
      side={side}
      overlay
      fallback={fallback}
      trigger={triggerElement}
    >
      <Content
        onMount={onMount}
        onUnmount={onUnmount}
        setIsOpen={setIsOpen}
        onErrorUpload={onErrorUpload}
        onSuccessUpload={onSuccessUpload}
        upload={upload}
      />
    </Popover>
  );
};

export default AddEmojiBtnWrapper;
