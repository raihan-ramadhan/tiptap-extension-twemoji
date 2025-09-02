import "./_styles.scss";

export type { Emoji } from "@/data/emoji-sprite-map";
export type {
  DropzoneUploadProps as EmojiUploadProps,
  CustomEmoji,
  StoredEmoji,
} from "@/types";

export {
  isEmoji,
  isActionBtn,
  isCustomEmoji,
  isGroupTitle,
} from "@/lib/emoji-grid-utils";

export { TwemojiExtension } from "./extension";

export { default as EmojiGrid } from "./components/emoji-grid/grid/Grid";

export { useEmojiGridState } from "./hooks/useEmojiGridState";
export { applyEmojiSpriteStyle } from "./lib/emojiSpriteStyle";
