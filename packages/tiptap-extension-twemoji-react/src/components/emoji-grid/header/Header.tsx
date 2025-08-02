import { SKIN_TONE_CODES_PROPS } from "@/lib/emoji-utils";
import { Dispatch, memo, SetStateAction, useCallback } from "react";
import { Emoji } from "@/data/emoji-sprite-map";
import { ComponentEmojiMentionProps } from "@/types";

// COMPONENTS
import SkinToneSelect from "./SkinToneSelect";
import RandomButton from "./RandomButton";
import RemoveButton from "./RemoveButton";
import Input from "./Input";

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
  onDelete?: () => void;
  closeAfterDelete?: boolean;
  onSkinListMount: () => void;
  onSkinListUnmount: () => void;
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
  onDelete,
  closeAfterDelete,
  onSkinListMount,
  onSkinListUnmount,
}: EmojiHeaderProps) => {
  const stopEnterPropagation = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter") {
        event.stopPropagation();
      }
    },
    []
  );

  return (
    <div className="flex gap-1 justify-end h-10 border-neutral-200 dark:border-neutral-800 border-b text-black dark:text-white p-1 transition duration-500">
      {headerInput ? (
        <Input
          stopEnterPropagation={stopEnterPropagation}
          query={query}
          setQuery={setQuery}
        />
      ) : null}
      {randomButton ? (
        <RandomButton
          filteredEmojis={filteredEmojis}
          stopEnterPropagation={stopEnterPropagation}
          callback={callback}
        />
      ) : null}
      {removeButton ? (
        <RemoveButton
          callback={onDelete}
          onCancel={onCancel}
          stopEnterPropagation={stopEnterPropagation}
          closeAfterDelete={closeAfterDelete}
        />
      ) : null}
      <SkinToneSelect
        setSkinTone={setSkinTone}
        skinTone={skinTone}
        onSkinListMount={onSkinListMount}
        onSkinListUnmount={onSkinListUnmount}
      />
    </div>
  );
};
export default memo(EmojiHeader);
