import "./add-emoji-popover.scss";

import { DropzoneUploadProps } from "@/types";
import {
  CancelOrSaveBtns,
  Dropzone,
  DropzoneEmptyState,
  DropzonePreview,
  LabelInput,
} from "./DropZone";
import { useEffect } from "react";
import { createFocusTrap, FocusTrap } from "focus-trap";

const Content = ({
  onMount,
  onUnmount,
  setIsOpen,
  onError,
  onSuccess,
  upload,
  accept,
  maxSize,
  focusTrap,
  subTrapRef,
}: {
  onMount: () => void;
  onUnmount: () => void;
  setIsOpen: (open: boolean) => void;
  subTrapRef: React.RefObject<HTMLDivElement | null>;
  focusTrap: React.RefObject<FocusTrap | null>;
} & Omit<
  DropzoneUploadProps,
  "disabledAddCustomEmoji" | "interceptAddCustomEmojiClick"
>) => {
  const dismiss = () => setIsOpen(false);

  useEffect(() => {
    onMount();
    return () => {
      onUnmount();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, () => void> = {
        Escape: dismiss,
      };

      const handler = keyMap[event.key];
      if (handler) {
        handler();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (subTrapRef.current) {
      focusTrap.current = createFocusTrap(subTrapRef.current, {
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
  }, []);

  return (
    <Dropzone
      onError={onError}
      onSuccess={onSuccess}
      upload={upload}
      accept={accept}
      maxSize={maxSize}
    >
      <div>
        <h3 className="content__title">Add Custom Emoji</h3>
        <p className={"content__description"}>
          Custom emoji can be used by anyone in your workspace
        </p>
      </div>
      <DropzoneEmptyState />
      <DropzonePreview />
      <LabelInput />
      <CancelOrSaveBtns dismiss={dismiss} />
    </Dropzone>
  );
};

export default Content;
