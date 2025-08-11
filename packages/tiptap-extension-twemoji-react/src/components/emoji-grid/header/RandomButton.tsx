import { memo, useCallback } from "react";
import { Shuffle } from "lucide-react";
import {
  getRandomCellByItemCount,
  isCustomEmoji,
  isEmoji,
} from "@/lib/emoji-grid-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { Emoji } from "@/data/emoji-sprite-map";
import { SelectEmojiFunc } from "@/types";
import { SKIN_TONE_CODES_PROPS, SKIN_TONE_MAP } from "../../../lib/emoji-utils";
import { MentionNodeAttrs } from "@tiptap/extension-mention";
import { SuggestionProps } from "@tiptap/suggestion";

const RandomButton = ({
  filteredEmojis,
  callback,
  stopEnterPropagation,
  skinTone,
  range,
}: {
  filteredEmojis: Emoji[];
  callback?: SelectEmojiFunc;
  stopEnterPropagation: (event: React.KeyboardEvent<HTMLElement>) => void;
  range?: SuggestionProps<any, MentionNodeAttrs>["range"];
  skinTone: SKIN_TONE_CODES_PROPS;
}) => {
  const handleRandomClick = useCallback(() => {
    if (callback) {
      const data = getRandomCellByItemCount(
        filteredEmojis.length,
        filteredEmojis
      );

      const tone: string = SKIN_TONE_MAP[skinTone].tone;

      const { skins } = data;

      let newEmoji = data;

      if (skinTone && skinTone !== "default" && skins && skins[tone]) {
        newEmoji = skins[tone] as Emoji;
      }
      callback({ emoji: newEmoji, baseHexcode: data.hexcode, range });
    }
  }, [callback, filteredEmojis, skinTone]);

  return (
    <Tooltip delay={200}>
      <TooltipTrigger
        className="aspect-square size-7 flex justify-center items-center twemoji-button twemoji-border"
        onClick={handleRandomClick}
        onKeyDown={stopEnterPropagation}
      >
        <Shuffle className="stroke-(length:--twemoji-icon-stroke-width)" />
      </TooltipTrigger>
      <TooltipContent>
        <span>Random</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default memo(RandomButton);
