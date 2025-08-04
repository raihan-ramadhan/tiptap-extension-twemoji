import { SKIN_TONE_CODES_PROPS } from "@/lib/emoji-utils";
import { Dispatch, memo, SetStateAction, useCallback } from "react";
import { Emoji } from "@/data/emoji-sprite-map";
import { ComponentEmojiMentionProps } from "@/types";

// COMPONENTS
import SkinToneSelect from "./SkinToneSelect";
import RandomButton from "./RandomButton";
import RemoveButton from "./RemoveButton";
import Input from "./Input";
import { CELL_HEIGHT, COLUMNS } from "@/constants";

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
  const widthGrid = COLUMNS * CELL_HEIGHT + 12;

  const stopEnterPropagation = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter") {
        event.stopPropagation();
      }
    },
    []
  );

  return (
    <div
      className="flex gap-1.5 justify-end h-fit border-(--twemoji-border-color) border-b p-1 transition duration-500"
      style={{
        width: widthGrid,
      }}
    >
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
        stopEnterPropagation={stopEnterPropagation}
        onSkinListUnmount={onSkinListUnmount}
        onSkinListMount={onSkinListMount}
        setSkinTone={setSkinTone}
        skinTone={skinTone}
      />
    </div>
  );
};
export default memo(EmojiHeader);
