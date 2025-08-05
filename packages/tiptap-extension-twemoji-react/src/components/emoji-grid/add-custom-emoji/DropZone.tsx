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
import { ExtensionOptions, UploadCustEmojiFunc } from "@/types";

export const MAX_FILES = 1;
export const MAX_FILE_SIZE = 1000 * 1000 * 10; // 10MB
export const ALLOWED_MIME_TYPES = ["image/*"];

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
  onError: ExtensionOptions["onError"];
  onSuccess: ExtensionOptions["onSuccess"];
};

const DropzoneContext = createContext<DropzoneContextProps | undefined>(
  undefined
);

type DropzoneProps = ExtensionOptions & {
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
  ...restProps
}: PropsWithChildren<DropzoneProps>) => {
  const [files, setFiles] = useState<FileWithPreview | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emojiName, setEmojiName] = useState<string>("");
  const [emojiNameError, setEmojiNameError] = useState<string | null>(null);

  useEffect(() => {
    const isValid = /^[a-z0-9_-]+$/.test(emojiName);
    const isLengthValid = emojiName.length < 50;

    if (emojiName === "" || (isValid && isLengthValid)) {
      setEmojiNameError(null);
    } else if (!isValid) {
      setEmojiNameError(
        "Name can only contain lowercase letters, numbers, hyphens, or underscores"
      );
    } else if (!isLengthValid) {
      setEmojiNameError("Name must be less than 50 characters");
    }
  }, [emojiName]);

  useEffect(() => {
    if (files && emojiName.length === 0) {
      const nameWithoutExt = files.name.replace(/\.[^/.]+$/, "");
      setEmojiName(nameWithoutExt);
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
                  `File is larger than ${formatBytes(MAX_FILE_SIZE, 2)} (Size: ${formatBytes(file.size, 2)})`
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
          onError: onError,
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
    accept: ALLOWED_MIME_TYPES.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const payLoad: DropzoneContextProps = {
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
    <DropzoneContext.Provider value={payLoad}>
      <div
        {...getRootProps({
          className: cn("p-4 flex flex-col gap-5 w-72", className),
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
    <div className="w-full flex justify-between">
      <button
        className="twemoji-button !py-1 !px-2 text-sm"
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
        className="twemoji-submit-button flex items-center gap-1 !py-1 !px-2 text-sm disabled:opacity-50"
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
    <div className="flex flex-col w-full gap-2">
      <label
        htmlFor="emoji-name"
        className="text-xs text-neutral-500 font-medium"
      >
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
        className="w-full py-2 px-3 text-sm twemoji-input"
      />
      {emojiNameError ? (
        <p className="text-red-400 text-xs">{emojiNameError}</p>
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
      <div className="bg-(--twemoji-accent-color) pt-4 pb-2 rounded flex flex-col gap-2 text-center">
        <p className="text-xs">Preview</p>
        <div className="flex w-full justify-center gap-2">
          <img
            src={files.preview}
            alt={files.name}
            className="p-1 object-contain h-12 w-12 rounded-(--twemoji-rounded) overflow-hidden shrink-0 flex items-center justify-center bg-black"
          />
          <img
            src={files.preview}
            alt={files.name}
            className="p-1 object-contain h-12 w-12 rounded-(--twemoji-rounded) overflow-hidden shrink-0 flex items-center justify-center bg-white"
          />
        </div>
        <div className="text-xs inline-flex justify-center items-center w-full">
          <button
            autoFocus
            className="flex justify-center items-center gap-1 py-2 px-3 twemoji-button"
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
    <div className={cn("flex flex-col items-center gap-y-2", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "twemoji-button bg-(--twemoji-accent-color) transition-colors duration-200 w-full flex items-center gap-1 justify-center !py-3",
          isDragActive && "bg-blue-400/20",
          isInvalid && "bg-red-400/20 hover:bg-red-400/20"
        )}
      >
        <Image size={15} />
        <span className="text-sm">Upload an image</span>
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
