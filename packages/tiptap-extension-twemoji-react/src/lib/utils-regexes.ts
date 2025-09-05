import EMOJI_EMOTICONS_MAP_RAW from "../data/emoji-emoticons-map.json";

export type EMOJI_SHORTCODES_EMOTICONS_VALUE = {
  hexcode: string;
  skinTones?: string;
};

export const EMOJI_EMOTICONS_MAP = EMOJI_EMOTICONS_MAP_RAW as {
  [emoticon: string]: EMOJI_SHORTCODES_EMOTICONS_VALUE;
};

import EMOJI_SHORTCODES_MAP_RAW from "../data/emoji-shortcodes-map.json";

export const EMOJI_SHORTCODES_MAP = EMOJI_SHORTCODES_MAP_RAW as {
  [shortcode: string]: EMOJI_SHORTCODES_EMOTICONS_VALUE;
};

export { shortcodesPattern } from "../data/emoji-shortcodes-pattern";
