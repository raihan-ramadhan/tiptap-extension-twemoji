import { Dispatch, SetStateAction, useRef, useState } from "react";
import { SKIN_TONE_CODES_PROPS, SKIN_TONE_MAP } from "@/lib/emoji-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { useClickOutside } from "@/hooks/use-click-outside";
import SkinList from "./SkinList";

const SkinToneSelect = ({
  skinTone,
  setSkinTone,
}: {
  setSkinTone: Dispatch<SetStateAction<SKIN_TONE_CODES_PROPS>>;
  skinTone: SKIN_TONE_CODES_PROPS;
}) => {
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
        />
      ) : (
        <Tooltip delay={200}>
          <TooltipTrigger
            ref={toneTriggerRef}
            className={`size-8 p-1 aspect-square cursor-pointer rounded-md flex justify-center items-center hover:bg-neutral-200 hover:dark:bg-neutral-800`}
            style={{
              padding: 0,
            }}
            onClick={() => setOpen((prev) => !prev)}
            onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
              if (event.key === "Enter") {
                event.stopPropagation();
              }
            }}
          >
            <span
              className="inline-block size-6 rounded"
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
