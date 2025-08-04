import { memo, useCallback } from "react";
import { Shuffle } from "lucide-react";
import { getRandomCellByItemCount } from "@/lib/emoji-grid-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { Emoji } from "@/data/emoji-sprite-map";
import { ComponentEmojiMentionProps } from "@/types";

const RandomButton = ({
  filteredEmojis,
  callback,
  stopEnterPropagation,
}: {
  filteredEmojis: Emoji[];
  callback?: ComponentEmojiMentionProps["callback"];
  stopEnterPropagation: (event: React.KeyboardEvent<HTMLElement>) => void;
}) => {
  const handleRandomClick = useCallback(() => {
    if (callback) {
      callback(getRandomCellByItemCount(filteredEmojis.length, filteredEmojis));
    }
  }, [callback, filteredEmojis]);

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
