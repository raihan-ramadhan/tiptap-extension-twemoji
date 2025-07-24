import EMOJIBASE_REGEX from "emojibase-regex";
import { shortcodesPattern } from "./emoji-shortcodes-pattern";

/**
 * Although Emojibase comes with `emojibase-regex/emoticon`, it unfortunately matches emoticons
 * permutations (i.e., `:)`, `:-)`), which are not part of the emoji dataset, making it impossible
 * to map emoticon permutations to a emoji emoji. Because of that, we create our own RegExp from our data in emoji-emoticons-map.json
 *
 * Ends the regex pattern on `$` dollar sign as documented here:
 * https://github.com/ueberdosis/tiptap/blob/f74f1ac/docs/guide/custom-extensions.md?plain=1#L410
 *
 * \\s at the end is trigger pattern, so to make emoticon works user must press space example: ":) "
 */
export const EMOTICON_REGEX = new RegExp(
  `(?::D|xD|XD|:'D|:'\\)|:\\)|;\\)|:>|o:\\)|O:\\)|:x|:X|:\\*|:p|:P|;p|;P|xp|xP|XP|:l|:L|:z|:Z|:\\||:#|:j|:\\?|8D|%\\(|:&|xo|XO|8\\)|:B|:/|:\\(|:o|:O|:\\$|:s|:S|:'\\(|:'o|Dx|x\\(|X\\(|:<|D:|:c|:C|>:/|:@|>:\\)|>:\\(|>0\\)|:3|</3|<3|\\\\m/|\\\\M/|:\\{>|:E|8#)\\s$`
);

/**
 * `(?<=^|\\s)` Use lookbehind to ensure the shortcode starts at a word boundary:
 * Start of string (^)
 * OR whitespace (\s)
 *
 * `(?=\\s|[.,!?)]|$)` Use lookahead to ensure the shortcode ends at a boundary:
 * Followed by space (\s)
 * OR punctuation (.,!?), closing paren )
 * OR end of string ($)
 */
export const EMOTICON_REGEX_PASTE = new RegExp(
  `(?<=^|\\s)(?::D|xD|XD|:'D|:'\\)|:\\)|;\\)|:>|o:\\)|O:\\)|:x|:X|:\\*|:p|:P|;p|;P|xp|xP|XP|:l|:L|:z|:Z|:\\||:#|:j|:\\?|8D|%\\(|:&|xo|XO|8\\)|:B|:/|:\\(|:o|:O|:\\$|:s|:S|:'\\(|:'o|Dx|x\\(|X\\(|:<|D:|:c|:C|>:/|:@|>:\\)|>:\\(|>0\\)|:3|</3|<3|\\\\m/|\\\\M/|:\\{>|:E|8#)(?=\\s|[.,!?)]|$)`,
  "gi"
);

/**
 * for consistency and to ensure the emoji is exist we create our own RegExp too from our data in emoji-shortcodes-map.json
 *
 * Ends the regex pattern on `$` dollar sign as documented here:
 * https://github.com/ueberdosis/tiptap/blob/f74f1ac/docs/guide/custom-extensions.md?plain=1#L410
 *
 * start with a colon `:(` and end with a colon `):` is trigger pattern, example: ":smile:" or "hug"
 */
export const SHORTCODES_REGEX = new RegExp(`:(?:${shortcodesPattern}):$`);

/**
 * `(?<=^|\\s)` Use lookbehind to ensure the shortcode starts at a word boundary:
 * Start of string (^)
 * OR whitespace (\s)
 *
 * `(?=\\s|[.,!?)]|$)` Use lookahead to ensure the shortcode ends at a boundary:
 * Followed by space (\s)
 * OR punctuation (.,!?), closing paren )
 * OR end of string ($)
 */
export const SHORTCODES_REGEX_PASTE = new RegExp(
  `(?<=^|\\s):(${shortcodesPattern}):(?=\\s|[.,!?)]|$)`,
  "gi"
);

/**
 * Create a "unicode" RegExp based on Emojibase's regex patterns
 *
 * Ends the regex pattern on `$` dollar sign as documented here:
 * https://github.com/ueberdosis/tiptap/blob/f74f1ac/docs/guide/custom-extensions.md?plain=1#L410
 */
export const UNICODE_REGEX = new RegExp(`(?:${EMOJIBASE_REGEX.source})$`);

export const UNICODE_REGEX_PASTE = new RegExp(
  `(?:${EMOJIBASE_REGEX.source})`,
  "g"
);

export const COMBINED_REGEX_PASTE = new RegExp(
  `(${SHORTCODES_REGEX_PASTE.source})|(${EMOTICON_REGEX_PASTE.source})|(${UNICODE_REGEX_PASTE.source})`,
  "g"
);
