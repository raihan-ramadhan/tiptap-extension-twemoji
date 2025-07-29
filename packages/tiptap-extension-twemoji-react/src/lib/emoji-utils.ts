import {
  ORIGINAL_EMOJI_SIZE,
  SPRITE_SHEET_HEIGHT,
  SPRITE_SHEET_WIDTH,
} from "@/data/sprite-sheet-details";
import emojis, { Emoji } from "@/data/emoji-sprite-map";

export type EMOJI_SHORTCODES_EMOTICONS_VALUE = {
  hexcode: string;
  skinTones?: string;
};

export type Hexcode = string;

export type Unicode = string;

export const SEQUENCE_REMOVAL_PATTERN = /200D|FE0E|FE0F/g;

export function fromUnicodeToHexcode(
  unicode: Unicode,
  strip: boolean = true
): Hexcode {
  const hexcode: string[] = [];

  [...unicode].forEach((codepoint) => {
    let hex = codepoint.codePointAt(0)?.toString(16).toUpperCase() ?? "";

    while (hex.length < 4) {
      hex = `0${hex}`;
    }

    if (!strip || (strip && !hex.match(SEQUENCE_REMOVAL_PATTERN))) {
      hexcode.push(hex);
    }
  });

  return hexcode.join("-");
}

import EMOJI_EMOTICONS_MAP_JSON from "@/assets/emoji-emoticons-map.json";

const EMOJI_EMOTICONS_MAP = EMOJI_EMOTICONS_MAP_JSON as {
  [emoticon: string]: EMOJI_SHORTCODES_EMOTICONS_VALUE;
};

import EMOJI_SHORTCODES_MAP_JSON from "@/assets/emoji-shortcodes-map.json";

const EMOJI_SHORTCODES_MAP = EMOJI_SHORTCODES_MAP_JSON as {
  [shortcode: string]: EMOJI_SHORTCODES_EMOTICONS_VALUE;
};

import { ExtendedRegExpMatchArray } from "@tiptap/core";
import {
  EMOTICON_REGEX,
  SHORTCODES_REGEX,
  UNICODE_REGEX,
} from "@/assets/emoji-regexes";
import { EMOJI_CLASS_NAME } from "@/constants";

export const SKIN_TONE_MAP = {
  default: {
    color: "#ffde61",
    tone: "0",
    colorLabel: "Default Yellow",
  },
  "1F3FB": {
    color: "#f7dfce",
    tone: "1",
    colorLabel: "Light",
  },
  "1F3FC": {
    color: "#f3d2a2",
    tone: "2",
    colorLabel: "Medium-Light",
  },
  "1F3FD": {
    color: "#d5ab87",
    tone: "3",
    colorLabel: "Medium",
  },
  "1F3FE": {
    color: "#af7e58",
    tone: "4",
    colorLabel: "Medium-Dark",
  },
  "1F3FF": {
    color: "#7b543f",
    tone: "5",
    colorLabel: "Dark",
  },
} as const;

export type SKIN_TONE_CODES_PROPS = keyof typeof SKIN_TONE_MAP;

export const SKIN_TONE_CODES_ARRAY: SKIN_TONE_CODES_PROPS[] = Object.keys(
  SKIN_TONE_MAP
) as SKIN_TONE_CODES_PROPS[];

// Used only for detecting if an emoji includes a skin tone
export const SKIN_TONE_CODES_SET = new Set(SKIN_TONE_CODES_ARRAY);

/* WARNING: this getEmojiIdPair function is temporary solution i made base what i read on emojibase repo and unicode.org https://www.unicode.org/Public/emoji/16.0/emoji-test.txt, basically this function guess the unicode is exist or not in our map emojis data */
// TODO: 1. Make my own data not dependance by emojibase
//       2. make my own system how to name the hexcode and choose the best unicode from different type of unicode

export function getEmojiDataFromUnicode(unicode: string): {
  baseHexcode: string;
  skinTones?: string;
} | null {
  const getTonesFromHexcode = (unicode: string) => {
    const hexcode = fromUnicodeToHexcode(unicode);

    const hexcodeArray: SKIN_TONE_CODES_PROPS[] = [];

    hexcode.split("-").forEach((cp) => {
      if (
        SKIN_TONE_CODES_SET.has(cp as SKIN_TONE_CODES_PROPS) &&
        !hexcodeArray.some((key) => key === cp)
      ) {
        hexcodeArray.push(cp as SKIN_TONE_CODES_PROPS);
      }
    });

    return hexcodeArray;
  };

  const tones = getTonesFromHexcode(unicode);

  const tonesNumbers = tones.map((tone) =>
    SKIN_TONE_CODES_ARRAY.findIndex((key) => key === tone)
  );

  const skinTones = tonesNumbers.join(",");

  // Remove skin tone modifiers
  function stripSkinTone(codepoints: string[]): string[] {
    return codepoints.filter(
      (cp) => !SKIN_TONE_CODES_SET.has(cp as SKIN_TONE_CODES_PROPS)
    );
  }

  const strippedHexcode = (hexcodes: string) =>
    stripSkinTone(hexcodes.split("-")).join("-");
  let baseHexcode;

  // Converts emoji to an array of Unicode codepoints as uppercase hex strings
  function getHexcode(emoji: string, strip: boolean = false): string {
    return fromUnicodeToHexcode(emoji, strip);
  }

  if (emojis[strippedHexcode(getHexcode(unicode))]) {
    // If the emoji exists in the emojis map, return its baseHexcode
    baseHexcode = strippedHexcode(getHexcode(unicode));
  } else if (emojis[strippedHexcode(getHexcode(unicode, true))]) {
    // If the emoji exists in the emojis map with stripped hexcode, return its baseHexcode
    baseHexcode = strippedHexcode(getHexcode(unicode, true));
  }

  if (!baseHexcode) return null;

  return {
    baseHexcode,
    skinTones,
  };
}

export const getEmojiSprite = ({
  hexcode,
  skinTones,
}: EMOJI_SHORTCODES_EMOTICONS_VALUE) => {
  let item: Emoji | undefined;

  if (!item) {
    if (!!skinTones) {
      item = {
        ...emojis[hexcode].skins![skinTones],
        hexcode: emojis[hexcode].skins![skinTones].hexcode!,
      };
    } else {
      item = { ...emojis[hexcode], hexcode: hexcode };
    }
  }

  return item;
};

export const TRANSPARENT_GIF =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

export const getAttributes = ({
  data,
  styleOption,
}: {
  data: Emoji;
  styleOption: {
    type: "string" | "object";
    sizeInpixel?: number;
  };
}) => {
  const { x, y, emoji } = data;

  const { type, sizeInpixel } = styleOption;

  const scaleFactor = sizeInpixel ? sizeInpixel / ORIGINAL_EMOJI_SIZE : 1;

  const positionX = sizeInpixel
    ? `${x * scaleFactor}px`
    : `${x / ORIGINAL_EMOJI_SIZE}em`;

  const positionY = sizeInpixel
    ? `${y * scaleFactor}px`
    : `${y / ORIGINAL_EMOJI_SIZE}em`;

  const getScaledBgSize = (size: number) => {
    return sizeInpixel
      ? `${(size * scaleFactor).toFixed(2)}px`
      : `${(size / ORIGINAL_EMOJI_SIZE).toFixed(2)}em`;
  };

  const scaledBgSizeX = getScaledBgSize(SPRITE_SHEET_WIDTH);
  const scaledBgSizeY = getScaledBgSize(SPRITE_SHEET_HEIGHT);

  const size = sizeInpixel ? `${sizeInpixel}px` : "1em";

  // i use TRANSPARENT_GIF just like what notion did :)
  const base = {
    src: TRANSPARENT_GIF,
    alt: emoji,
    draggable: false,
    className: EMOJI_CLASS_NAME,
    [type === "object" ? "contentEditable" : "contenteditable"]: false,
  };

  if (type === "object") {
    return {
      ...base,
      style: {
        width: size,
        height: size,
        backgroundPosition: `-${positionX} -${positionY}`,
        backgroundSize: `${scaledBgSizeX} ${scaledBgSizeY}`,
      } as React.CSSProperties,
    };
  }

  return {
    ...base,
    style: `width: 1em; height: 1em; background-position: -${positionX} -${positionY}; background-size: ${scaledBgSizeX} ${scaledBgSizeY};`,
  };
};

export function getEmojiAttributes(match: ExtendedRegExpMatchArray) {
  let data;

  const matchedInput = match[0];

  if (UNICODE_REGEX.test(matchedInput)) {
    const emoji = getEmojiDataFromUnicode(matchedInput);
    if (emoji) {
      const { baseHexcode, skinTones } = emoji;
      data = getEmojiSprite({ hexcode: baseHexcode, skinTones });
    }
  } else if (SHORTCODES_REGEX.test(matchedInput)) {
    data = getEmojiSprite(
      EMOJI_SHORTCODES_MAP[matchedInput.replace(/^:+|:+$/g, "")]
    );
  } else if (EMOTICON_REGEX.test(matchedInput.replace(/\s*$/, " "))) {
    data = getEmojiSprite(
      EMOJI_EMOTICONS_MAP[matchedInput.replace(/\s+$/, "")]
    );
  }

  if (!data) return {};

  const attrs = getAttributes({
    data,
    styleOption: { type: "string" },
  });

  return attrs;
}
