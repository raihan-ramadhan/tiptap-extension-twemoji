import { cn } from "@/lib/utils";
import { Image, Loader2, RefreshCcw } from "lucide-react";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DropzoneState, FileRejection, useDropzone } from "react-dropzone";
import { DropzoneUploadProps } from "@/types";

export const MAX_FILES = 1;

export const formatBytes = (
  bytes: number,
  decimals = 2,
  size?: "bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"
) => {
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (bytes === 0 || bytes === undefined)
    return size !== undefined ? `0 ${size}` : "0 bytes";
  const i =
    size !== undefined
      ? sizes.indexOf(size)
      : Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

type DropzoneContextProps = Omit<
  DropzoneState,
  "getRootProps" | "getInputProps"
> & {
  open: () => void;
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview | null>>;
  files: FileWithPreview | null;
  emojiName: string;
  setEmojiName: React.Dispatch<React.SetStateAction<string>>;
  emojiNameError: string | null;
  loading: boolean;
  onUpload: ({ callback }: { callback?: () => void }) => Promise<void>;
  onError: DropzoneUploadProps["onError"];
  onSuccess: DropzoneUploadProps["onSuccess"];
};

const DropzoneContext = createContext<DropzoneContextProps | undefined>(
  undefined
);

type DropzoneProps = DropzoneUploadProps & {
  className?: string;
};

export type FileWithPreview = File & {
  preview?: string;
};

const Dropzone = ({
  className,
  children,
  upload: uploadCallback,
  onError,
  onSuccess,
  accept,
  maxSize,
  ...restProps
}: PropsWithChildren<DropzoneProps>) => {
  const [files, setFiles] = useState<FileWithPreview | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emojiName, setEmojiName] = useState<string>("");
  const [emojiNameError, setEmojiNameError] = useState<string | null>(null);

  const VALID_NAME_REGEX = /^[a-z0-9_-]+$/;

  function cleanEmojiName(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  }

  function validateEmojiName(name: string): string | null {
    if (name === "") return null;
    if (!VALID_NAME_REGEX.test(name)) {
      return "Name can only contain lowercase letters, numbers, hyphens, or underscores";
    }
    if (name.length >= 50) {
      return "Name must be less than 50 characters";
    }
    return null;
  }

  useEffect(() => {
    const error = validateEmojiName(emojiName);
    setEmojiNameError(error);
  }, [emojiName]);

  useEffect(() => {
    if (files && emojiName.length === 0) {
      const nameWithoutExt = files.name.replace(/\.[^/.]+$/, "");
      const cleanedName = cleanEmojiName(nameWithoutExt);
      setEmojiName(cleanedName);
    }
  }, [files]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const cloned = new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        });

        const validFile: FileWithPreview = Object.assign(cloned, {
          preview: URL.createObjectURL(file),
        });

        setFiles(validFile);
      }

      if (acceptedFiles.length > MAX_FILES) {
        if (onError) onError("Too many files, max files: 1");
      }

      if (fileRejections.length > 0) {
        fileRejections.map(({ errors, file }) => {
          errors.map((error) => {
            if (error.message.startsWith("File is larger than")) {
              if (onError)
                onError(
                  `File is larger than ${formatBytes(maxSize, 2)} (Size: ${formatBytes(file.size, 2)})`
                );
            } else {
              if (onError) onError(error.message);
            }
          });
        });
      }
    },
    [files, setFiles]
  );

  const onUpload: DropzoneContextProps["onUpload"] = useCallback(
    async ({ callback }) => {
      setLoading(true);
      if (emojiNameError || !files) return setLoading(false);

      if (uploadCallback) {
        await uploadCallback({
          emojiName,
          files,
          onError,
          onSuccess,
          callback,
        });
      } else {
        console.error(
          "Error: Please define a upload function in configure twemoji extension"
        );
      }

      setLoading(false);
    },
    [files, emojiNameError, emojiName]
  );

  const { getInputProps, getRootProps, ...dropzoneProps } = useDropzone({
    onDrop,
    noClick: true,
    accept,
    maxSize,
    multiple: true,
  });

  const value: DropzoneContextProps = {
    ...restProps,
    ...dropzoneProps,
    files,
    setFiles,
    emojiName,
    setEmojiName,
    emojiNameError,
    loading,
    onUpload,
    onError,
    onSuccess,
  };

  return (
    <DropzoneContext.Provider value={value}>
      <div
        {...getRootProps({
          className: cn("content", className),
        })}
        tabIndex={-1}
      >
        <input {...getInputProps({ multiple: MAX_FILES > 1 })} tabIndex={-1} />
        {children}
      </div>
    </DropzoneContext.Provider>
  );
};

const CancelOrSaveBtns = ({ dismiss }: { dismiss: () => void }) => {
  const { setFiles, files, loading, onUpload, setEmojiName } =
    useDropzoneContext();

  return (
    <div className="content__cancel-or-save">
      <button
        className="twemoji-button content__cancel-or-save__cancel"
        type="button"
        onClick={() => {
          setFiles(null);
          dismiss();
          setEmojiName("");
        }}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={() => {
          if (files) onUpload({ callback: dismiss });
        }}
        disabled={!files || loading}
        className="twemoji-submit-button content__cancel-or-save__save"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Saving
          </>
        ) : (
          <>Save</>
        )}
      </button>
    </div>
  );
};

const LabelInput = () => {
  const { emojiName, setEmojiName, emojiNameError } = useDropzoneContext();

  return (
    <div className="content__label-input">
      <label htmlFor="emoji-name" className="content__label">
        Emoji Name
      </label>
      <input
        onChange={(e) => {
          setEmojiName(e.target.value);
        }}
        type="text"
        id="emoji-name"
        placeholder="have-fun-with-it"
        value={emojiName}
        className="twemoji-input content__input"
      />
      {emojiNameError ? (
        <p className="content__error-label">{emojiNameError}</p>
      ) : null}
    </div>
  );
};

const DropzonePreview = () => {
  const { inputRef, files } = useDropzoneContext();

  if (!files) {
    return null;
  }

  return (
    <div>
      <div className="content__dropzone-preview">
        <p>Preview</p>
        <div className="content__dropzone-preview__images-wrapper">
          <img src={files.preview} alt={files.name} className="dark-preview" />
          <img src={files.preview} alt={files.name} className="light-preview" />
        </div>
        <div className="content__dropzone-preview__replace-wrapper">
          <button
            autoFocus
            className="twemoji-button content__dropzone-preview__replace-button"
            onClick={() => inputRef.current?.click()}
          >
            <RefreshCcw size={12} /> Replace
          </button>
        </div>
      </div>
    </div>
  );
};

const DropzoneEmptyState = ({ className }: { className?: string }) => {
  const { inputRef, isDragActive, isDragReject, files } = useDropzoneContext();

  if (files) {
    return null;
  }

  const isInvalid = isDragActive && isDragReject;

  return (
    <div className={cn("content__empty-state", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "twemoji-button content__empty-state__button",
          isDragActive && "content__empty-state__button--active",
          isInvalid && "content__empty-state__button--invalid"
        )}
      >
        <Image size={15} />
        <span>Upload an image</span>
      </button>
    </div>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone");
  }

  return context;
};

export {
  Dropzone,
  DropzoneEmptyState,
  useDropzoneContext,
  LabelInput,
  DropzonePreview,
  CancelOrSaveBtns,
};
