import { ExtensionOptions, UploadCustEmojiFunc } from "@/types";
import {
  CancelOrSaveBtns,
  Dropzone,
  DropzoneEmptyState,
  DropzonePreview,
  LabelInput,
} from "./DropZone";
import { useEffect } from "react";

const Content = ({
  onMount,
  onUnmount,
  setIsOpen,
  onError,
  onSuccess,
  upload,
}: {
  onMount: () => void;
  onUnmount: () => void;
  setIsOpen: (open: boolean) => void;
} & ExtensionOptions) => {
  const dismiss = () => setIsOpen(false);

  useEffect(() => {
    onMount();
    return () => {
      onUnmount();
    };
  }, []);

  return (
    <Dropzone onError={onError} onSuccess={onSuccess} upload={upload}>
      <div>
        <h3 className={"font-medium text-base"}>Add Custom Emoji</h3>
        <p className={"text-xs text-neutral-500"}>
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
