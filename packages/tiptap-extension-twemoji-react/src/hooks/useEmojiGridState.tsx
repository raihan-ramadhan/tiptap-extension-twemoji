import { useMemo, useState } from "react";

// Store
import { latestCustomEmojis } from "@/store/custom-emojis-store";

// Utilities
import { getEmojiSprite } from "@/lib/emoji-utils";

// TYPES
import { CustomEmoji, StoredEmoji, SuggestionItems } from "@/types";

// CONSTANTS
import { LOCAL_STORAGE_RECENT_EMOJIS_KEY } from "@/constants";

// ASSETS & DATA
import emojisSubstringIndexes from "@/assets/emoji-substring-index.json";
import emojiSpriteOrder from "@/data/emoji-sprite-order";
import emojis, { Emoji } from "@/data/emoji-sprite-map";

export function useEmojiGridState() {
  const [query, setQuery] = useState<string>("");
  const lowerQuery = query.toLowerCase().trim();

  const filteredCustomEmojis = useMemo(() => {
    return latestCustomEmojis.filter(({ label }) => label.includes(lowerQuery));
  }, [lowerQuery]);

  const emojisIndexes = emojisSubstringIndexes as Record<string, string[]>;
  const matchedHexcodes =
    lowerQuery.length > 0 ? emojisIndexes[lowerQuery] : emojiSpriteOrder;

  const filteredEmojis = useMemo(() => {
    if (!matchedHexcodes?.length) return [];
    return matchedHexcodes.map((hexcode) => ({
      ...emojis[hexcode],
      hexcode,
    })) as Emoji[];
  }, [matchedHexcodes]);

  const recentEmojis = useMemo(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(LOCAL_STORAGE_RECENT_EMOJIS_KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as StoredEmoji[];
      return parsed.map(({ hexcode, ...rest }) =>
        hexcode ? getEmojiSprite({ hexcode }) : (rest as CustomEmoji)
      );
    } catch {
      return null;
    }
  }, []);

  const items: SuggestionItems[] = [
    {
      filteredEmojis,
      filteredCustomEmojis,
      recent: recentEmojis,
    },
  ];

  return {
    query,
    setQuery,
    items,
    filteredEmojis,
  };
}
