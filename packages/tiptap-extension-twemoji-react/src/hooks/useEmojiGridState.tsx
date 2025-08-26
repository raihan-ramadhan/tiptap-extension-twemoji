import { useMemo, useState } from "react";

// Utilities
import { getEmojiSprite } from "@/lib/emoji-utils";

// TYPES
import { CustomEmoji, StoredEmoji, SuggestionItems } from "@/types";

// ASSETS & DATA
import emojisSubstringIndexes from "@/assets/emoji-substring-index.json";
import emojiSpriteOrder from "@/data/emoji-sprite-order";
import emojis, { Emoji } from "@/data/emoji-sprite-map";

export function useEmojiGridState({
  customEmojis = [],
  localStorageRecentEmojisKey,
}: {
  customEmojis?: CustomEmoji[];
  localStorageRecentEmojisKey: string;
}) {
  const [query, setQuery] = useState<string>("");
  const lowerQuery = query.toLowerCase().trim();

  const filteredCustomEmojis = useMemo(() => {
    return customEmojis.filter(({ label }) => label.includes(lowerQuery));
  }, [lowerQuery, customEmojis]);

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

  function loadRecentEmojis(
    query: string
  ): (ReturnType<typeof getEmojiSprite> | CustomEmoji)[] | null {
    if (query.length > 0 || typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem(localStorageRecentEmojisKey);
      if (!stored) return null;

      const parsed: StoredEmoji[] = JSON.parse(stored);

      return parsed.map(({ hexcode, ...rest }) =>
        hexcode ? getEmojiSprite({ hexcode }) : (rest as CustomEmoji)
      );
    } catch {
      return null;
    }
  }

  const recentEmojis = loadRecentEmojis(query);

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
