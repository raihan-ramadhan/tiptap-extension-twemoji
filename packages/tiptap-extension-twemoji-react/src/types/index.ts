import { EmojiMap, Emoji } from "@/data/emoji-sprite-map";
import { SKIN_TONE_CODES_PROPS } from "@/lib/emoji-utils";
import { Dispatch, Ref, RefObject, SetStateAction } from "react";
import { SuggestionProps } from "@tiptap/suggestion";
import { MentionNodeAttrs } from "@tiptap/extension-mention";
import { Editor } from "@tiptap/react";
import { FileWithPreview } from "@/components/emoji-grid/add-custom-emoji/DropZone";

export type DropzoneUploadProps = {
  upload: (props: {
    emojiName: string;
    files: FileWithPreview;
    onSuccess: DropzoneUploadProps["onSuccess"];
    onError: DropzoneUploadProps["onError"];
    dismiss?: () => void;
  }) => Promise<void>;
  onError: (errorMessage: string) => void;
  onSuccess: (successMessage: string, callback?: () => void) => void;
  accept: {
    [key: string]: readonly string[];
  };
  maxSize: number;
  interceptAddCustomEmojiClick:
    | ((dismiss?: () => void) => boolean)
    | ((dismiss?: () => void) => Promise<boolean>)
    | boolean;
  disabledAddCustomEmoji: boolean;
};

export type HeaderUisProps = {
  headerInput: boolean;
  skinToneSelect: boolean;
  randomButton: boolean;
  removeButton: boolean;
};

export type ExtensionHeaderOptions = {
  /**
   * Show <RandomButton />
   * @default true
   */
  randomButton?: HeaderUisProps["randomButton"];
  /**
   * Show <SkinToneSelect />
   * @default true
   */
  skinToneSelect?: HeaderUisProps["skinToneSelect"];
};

export type ExtensionCustomEmojiOptions = {
  /**
   * Function to handle the upload process.
   */
  upload?: DropzoneUploadProps["upload"];
  /**
   * Callback for upload errors.
   */
  onError?: DropzoneUploadProps["onError"];
  /**
   * Callback for successful uploads.
   */
  onSuccess?: DropzoneUploadProps["onSuccess"];
  /**
   * Acceptable file types for upload.
   * @default  { "image/*": [] }
   *
   * See: https://react-dropzone.org/#!/Accepting%20specific%20file%20types
   */
  accept?: DropzoneUploadProps["accept"];
  /**
   * Maximum file size in bytes.
   * @default 1000 * 1000 * 10 // 10MB
   */
  maxSize?: DropzoneUploadProps["maxSize"];
  /**
   * return true or give value true to intercept and stop click event in add custom emoji
   */
  interceptAddCustomEmojiClick?: DropzoneUploadProps["interceptAddCustomEmojiClick"];
  /**
   * disabled nav add custom emoji button and remove "Add Emoji" cell in grid
   */
  disabledAddCustomEmoji?: DropzoneUploadProps["disabledAddCustomEmoji"];
};

export type ExtensionNavOptions = {
  /**
   * Minimal quantity of cell or emojis to hide nav from EmojiGrid
   * @default
   */
  minCellsToHideNav?: number;
};

export type ExtensionGridOptions = {
  visibleRows?: number;
  cellSize?: number;
};

export type SelectedCellElementRef = RefObject<HTMLButtonElement | null>;

export type CustomEmoji = { label: string; url: string; id: string };

export type StoredEmoji = {
  hexcode?: string;
  label?: string;
  url?: string;
  id?: string;
};

export type Items = {
  category?: string;
  emojis?: EmojiMap;
}[];

export type EmojiListRef = {
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
};

export type SuggestionItems = {
  recent: (Emoji | CustomEmoji)[] | null;
  filteredEmojis: Emoji[];
  filteredCustomEmojis?: CustomEmoji[];
};

export type Range = SuggestionProps<any, MentionNodeAttrs>["range"] | undefined;

export type ComponentEmojiMentionProps = DropzoneUploadProps &
  HeaderUisProps & {
    items: SuggestionItems[];
    ref?: Ref<EmojiListRef>;
    onCancel?: () => void;
    onSelectEmoji: SelectEmojiFunc;
    range?: Range;
    query?: string;
    setQuery?: Dispatch<SetStateAction<string>>;
    editor?: Editor;
    focusImmediately?: boolean;
    onDelete?: () => void;
    closeAfterDelete?: boolean;
    minCellsToHideNav: number;
    visibleRows: number;
    cellSize: number;
    triggerRef?: React.RefObject<HTMLButtonElement | null>;
  };

export type GroupTitle = { groupTitle: string };
export type ActionBtn = {
  buttonLabel: string;
  align?: "start" | "center" | "end";
};

export type CELL_TYPES =
  | Emoji
  | CustomEmoji
  | ActionBtn
  | GroupTitle
  | undefined;

export type ARRAY2D_ITEM_PROPS = CELL_TYPES[];

export type SelectEmojiFunc = (props: {
  emoji: Emoji | CustomEmoji;
  baseHexcode?: string;
  range?: Range;
}) => void;

export type SelectedCell = {
  row: number;
  column: number;
};

export type ItemData = DropzoneUploadProps & {
  arr2d: ARRAY2D_ITEM_PROPS[];
  selectedCell: SelectedCell;
  onSelectEmoji: SelectEmojiFunc;
  selectedCellElementRef: SelectedCellElementRef;
  skinTone: SKIN_TONE_CODES_PROPS;
  range?: Range;
  cellRefs: React.RefObject<Map<string, HTMLDivElement | HTMLButtonElement>>;
  handleHover: (row: number, col: number) => void;
  disableEmojiCellsNavigation: () => void;
  enableEmojiCellsNavigation: () => void;
  deactivateTrap: () => void;
  activateTrap: () => void;
  cellSize: number;
  onCancel?: () => void;
};
