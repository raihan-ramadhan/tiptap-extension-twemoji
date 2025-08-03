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
    <div className="h-full flex items-center justify-center mr-2" ref={ref}>
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
            className="size-7 aspect-square cursor-pointer flex justify-center items-center hover:bg-neutral-200 hover:dark:bg-neutral-800 rounded-[8px] p-1.5 outline-1 outline-(--border-color) focus-visible:outline-2 focus-visible:outline-(--focus-active-color) focus-visible:-outline-offset-[2px]"
            onClick={() => setOpen((prev) => !prev)}
            onKeyDown={stopEnterPropagation}
          >
            <span
              className="inline-block size-full rounded-[4px]"
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
