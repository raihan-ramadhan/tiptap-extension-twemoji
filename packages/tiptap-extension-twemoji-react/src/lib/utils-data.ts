import { EmojiMap } from "@/types";
import emojisRaw from "../data/emoji-sprite-map.json";

export const emojis = emojisRaw as EmojiMap;
export { default as emojisSubstringIndexes } from "../data/emoji-substring-index.json";
export { default as emojiSpriteOrder } from "../data/emoji-sprite-order";
