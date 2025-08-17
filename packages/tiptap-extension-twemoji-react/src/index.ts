import "./_styles.scss";

export type {
  CustomEmoji,
  DropzoneUploadProps as EmojiUploadProps,
} from "@/types";
export type { Emoji } from "@/data/emoji-sprite-map";

export {
  isEmoji,
  isActionBtn,
  isCustomEmoji,
  isGroupTitle,
} from "@/lib/emoji-grid-utils";

export { TwemojiExtension } from "./extension";
