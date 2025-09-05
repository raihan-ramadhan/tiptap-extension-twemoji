import "./header.scss";

import { SKIN_TONE_CODES_PROPS } from "@/lib/emoji-utils";
import { Dispatch, memo, SetStateAction, useCallback, useState } from "react";
import {
  ComponentEmojiMentionProps,
  HeaderUisProps,
  SelectEmojiFunc,
  Emoji,
} from "@/types";

// COMPONENTS
import SkinToneSelect from "./SkinToneSelect";
import RandomButton from "./RandomButton";
import RemoveButton from "./RemoveButton";
import Input from "./Input";
import { SuggestionProps } from "@tiptap/suggestion";
import { MentionNodeAttrs } from "@tiptap/extension-mention";

export type EmojiHeaderProps = {
  skinTone: SKIN_TONE_CODES_PROPS;
  setSkinTone: Dispatch<SetStateAction<SKIN_TONE_CODES_PROPS>>;
  query?: string;
  setQuery?: Dispatch<SetStateAction<string>>;
  filteredEmojis: Emoji[];
  onSelectEmoji?: SelectEmojiFunc;
  onCancel?: ComponentEmojiMentionProps["onCancel"];
  onDelete?: () => void;
  closeAfterDelete?: boolean;
  onSkinListMount: () => void;
  onSkinListUnmount: () => void;
  range?: SuggestionProps<any, MentionNodeAttrs>["range"];
  widthGrid: number;
} & HeaderUisProps;

const EmojiHeader = ({
  skinTone,
  setSkinTone,
  query,
  setQuery,
  headerInput,
  filteredEmojis,
  onSelectEmoji,
  randomButton,
  removeButton,
  onCancel,
  onDelete,
  closeAfterDelete,
  onSkinListMount,
  onSkinListUnmount,
  skinToneSelect,
  range,
  widthGrid,
}: EmojiHeaderProps) => {
  const [openSkinSelect, setOpenSkinSelect] = useState<boolean>(false);

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
      className="twemoji-header"
      style={{
        width: widthGrid,
      }}
    >
      {openSkinSelect ? null : (
        <>
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
              callback={onSelectEmoji}
              skinTone={skinTone}
              range={range}
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
        </>
      )}
      {skinToneSelect ? (
        <SkinToneSelect
          open={openSkinSelect}
          setOpen={setOpenSkinSelect}
          stopEnterPropagation={stopEnterPropagation}
          onSkinListUnmount={onSkinListUnmount}
          onSkinListMount={onSkinListMount}
          setSkinTone={setSkinTone}
          skinTone={skinTone}
        />
      ) : null}
    </div>
  );
};
export default memo(EmojiHeader);
