import { Dispatch, SetStateAction, memo, useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { SKIN_TONE_CODES_PROPS, SKIN_TONE_MAP } from "@/lib/emoji-utils";
import { cn } from "@/lib/utils";
import { LOCAL_STORAGE_SKIN_TONE_KEY } from "@/constants";

const SkinItem = ({
  code,
  skinTone,
  setSkinTone,
  setOpen,
  toneTriggerRef,
}: {
  code: SKIN_TONE_CODES_PROPS;
  skinTone: SKIN_TONE_CODES_PROPS;
  setSkinTone: Dispatch<SetStateAction<SKIN_TONE_CODES_PROPS>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toneTriggerRef: React.RefObject<HTMLButtonElement | null>;
}) => {
  const handleSelect = useCallback(() => {
    if (code !== skinTone) {
      localStorage.setItem(LOCAL_STORAGE_SKIN_TONE_KEY, code);
      setSkinTone(code);
    }
    setOpen(false);
    requestAnimationFrame(() => {
      toneTriggerRef.current?.focus();
    });
  }, [code, skinTone, setSkinTone, setOpen, toneTriggerRef]);

  return (
    <Tooltip delay={200}>
      <li>
        <TooltipTrigger
          onClick={handleSelect}
          className={cn(
            "size-8 p-0 aspect-square cursor-pointer rounded-md flex justify-center items-center hover:bg-neutral-200 hover:dark:bg-neutral-800",
            code === skinTone && "ring ring-blue-500"
          )}
          autoFocus={code === skinTone}
          draggable={false}
        >
          <span
            className="inline-block size-6 rounded"
            style={{
              backgroundColor: SKIN_TONE_MAP[code].color,
            }}
          />
        </TooltipTrigger>
      </li>
      <TooltipContent>
        <span>{SKIN_TONE_MAP[code].colorLabel}</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default memo(SkinItem);
