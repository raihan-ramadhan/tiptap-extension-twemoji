import "./styles.css";

export type { CustomEmoji, UploadCustEmojiProps } from "@/types";
export type { Emoji } from "@/data/emoji-sprite-map";

export {
  isEmoji,
  isActionBtn,
  isCustomEmoji,
  isGroupTitle,
} from "@/lib/emoji-grid-utils";

export { setLatestCustomEmojis } from "@/store/custom-emojis-store";

export { TwemojiExtension, updateEmojiGridItems } from "./extension";
