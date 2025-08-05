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
          onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
            if (event.key === "Enter") {
              event.stopPropagation();
            }
          }}
          className={cn(
            "size-7 aspect-square flex justify-center items-center twemoji-button twemoji-border",
            code === skinTone && "bg-(--twemoji-secondary-color)"
          )}
          autoFocus={code === skinTone}
          draggable={false}
        >
          <span
            className="inline-block size-full rounded-[4px]"
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
