import { EmojiMap, Emoji } from "@/data/emoji-sprite-map";
import { SKIN_TONE_CODES_PROPS } from "@/lib/emoji-utils";
import { Dispatch, Ref, RefObject, SetStateAction } from "react";
import { SuggestionProps } from "@tiptap/suggestion";
import { MentionNodeAttrs } from "@tiptap/extension-mention";
import { Editor } from "@tiptap/react";
import { FileWithPreview } from "@/components/emoji-grid/add-custom-emoji/DropZone";
import { EmojiHeaderProps } from "@/components/emoji-grid/header/Header";

export type ExtensionOptions = {
  upload?: UploadCustEmojiFunc;
  onError?: (errorMessage: string) => void;
  onSuccess?: (successMessage: string, callback?: () => void) => void;
};

export type UploadCustEmojiProps = {
  emojiName: string;
  files: FileWithPreview;
  onSuccess: ExtensionOptions["onSuccess"];
  onError: ExtensionOptions["onError"];
  callback?: () => void;
};

export type UploadCustEmojiFunc = (
  props: UploadCustEmojiProps
) => Promise<void>;

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

export type ComponentEmojiMentionProps = ExtensionOptions & {
  items: SuggestionItems[];
  ref?: Ref<EmojiListRef>;
  onCancel?: () => void;
  onSelectEmoji: SelectEmojiFunc;
  range?: Range;
  query?: string;
  setQuery?: Dispatch<SetStateAction<string>>;
  headerInput?: EmojiHeaderProps["headerInput"];
  removeButton?: EmojiHeaderProps["removeButton"];
  randomButton?: EmojiHeaderProps["randomButton"];
  editor?: Editor;
  callback?: (emoji: Emoji | null) => void;
  focusImmediately?: boolean;
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

export type ItemData = ExtensionOptions & {
  arr2d: ARRAY2D_ITEM_PROPS[];
  selectedCell: SelectedCell;
  onSelectEmoji: SelectEmojiFunc;
  selectedCellElementRef: SelectedCellElementRef;
  skinTone: SKIN_TONE_CODES_PROPS;
  range?: Range;
  setKeyboardEnabled: Dispatch<SetStateAction<boolean>>;
  cellRefs: React.RefObject<Map<string, HTMLDivElement | HTMLButtonElement>>;
  handleHover: (row: number, col: number) => void;
};
