import {
  getRandomCellByItemCount,
  SKIN_TONE_CODES_PROPS,
} from "@/lib/emoji-utils";
import { Dispatch, SetStateAction } from "react";
import SkinToneSelect from "./SkinToneSelect";
import { Shuffle, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { cn } from "@/lib/utils";
import { Emoji } from "@/data/emoji-sprite-map";
import { ComponentEmojiMentionProps } from "@/types";

export type EmojiHeaderProps = {
  headerInput?: boolean;
  randomButton?: boolean;
  removeButton?: boolean;
  skinTone: SKIN_TONE_CODES_PROPS;
  setSkinTone: Dispatch<SetStateAction<SKIN_TONE_CODES_PROPS>>;
  query?: string;
  setQuery?: Dispatch<SetStateAction<string>>;
  filteredEmojis: Emoji[];
  callback?: ComponentEmojiMentionProps["callback"];
  onCancel?: ComponentEmojiMentionProps["onCancel"];
};

const EmojiHeader = ({
  skinTone,
  setSkinTone,
  query,
  setQuery,
  headerInput = false,
  filteredEmojis,
  callback,
  randomButton,
  removeButton,
  onCancel,
}: EmojiHeaderProps) => {
  return (
    <div className="flex gap-1 justify-end h-10 border-neutral-200 dark:border-neutral-800 border-b text-black dark:text-white p-1 transition duration-500">
      {headerInput ? (
        <input
          className={cn(
            "flex-1 grow flex bg-white/10 focus-within:ring-blue-600 focus-within:ring focus:outline-none"
          )}
          value={query}
          onChange={(e) => {
            if (setQuery) {
              setQuery(e.target.value);
            }
          }}
        />
      ) : null}
      {randomButton ? (
        <Tooltip delay={200}>
          <TooltipTrigger
            className="aspect-square h-full"
            onClick={() => {
              if (callback) {
                callback(
                  getRandomCellByItemCount(
                    filteredEmojis.length,
                    filteredEmojis
                  )
                );
              }
            }}
          >
            <Shuffle />
          </TooltipTrigger>
          <TooltipContent>
            <span>Random</span>
          </TooltipContent>
        </Tooltip>
      ) : null}
      {removeButton ? (
        <Tooltip delay={200}>
          <TooltipTrigger
            className="aspect-square h-full"
            onClick={() => {
              if (callback) callback(null);
              if (onCancel) onCancel();
            }}
          >
            <Trash />
          </TooltipTrigger>
          <TooltipContent>
            <span>Remove</span>
          </TooltipContent>
        </Tooltip>
      ) : null}
      <SkinToneSelect setSkinTone={setSkinTone} skinTone={skinTone} />
    </div>
  );
};

export default EmojiHeader;
