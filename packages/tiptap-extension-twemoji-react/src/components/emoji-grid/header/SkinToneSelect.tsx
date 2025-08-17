import { Dispatch, SetStateAction, useRef, useState } from "react";
import { SKIN_TONE_CODES_PROPS, SKIN_TONE_MAP } from "@/lib/emoji-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { useClickOutside } from "@/hooks/use-click-outside";
import SkinList from "./SkinList";

type SkinToneSelectProps = {
  setSkinTone: Dispatch<SetStateAction<SKIN_TONE_CODES_PROPS>>;
  skinTone: SKIN_TONE_CODES_PROPS;
  onSkinListMount: () => void;
  onSkinListUnmount: () => void;
  stopEnterPropagation: (event: React.KeyboardEvent<HTMLElement>) => void;
};

const SkinToneSelect = ({
  skinTone,
  setSkinTone,
  onSkinListMount,
  onSkinListUnmount,
  stopEnterPropagation,
}: SkinToneSelectProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);
  const toneTriggerRef = useRef<HTMLButtonElement>(null);

  useClickOutside(ref, () => {
    setOpen(false);
  });

  return (
    <div className="twemoji-header__skintone__select" ref={ref}>
      {open ? (
        <SkinList
          setOpen={setOpen}
          setSkinTone={setSkinTone}
          skinTone={skinTone}
          toneTriggerRef={toneTriggerRef}
          onMount={onSkinListMount}
          onUnmount={onSkinListUnmount}
        />
      ) : (
        <Tooltip delay={200}>
          <TooltipTrigger
            ref={toneTriggerRef}
            className="twemoji-header__button twemoji-button twemoji-border"
            onClick={() => setOpen((prev) => !prev)}
            onKeyDown={stopEnterPropagation}
          >
            <span
              className="twemoji-header__skintone__color_span"
              style={{
                backgroundColor: SKIN_TONE_MAP[skinTone].color,
              }}
            />
          </TooltipTrigger>

          <TooltipContent>
            <span>Select skin tone</span>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default SkinToneSelect;
