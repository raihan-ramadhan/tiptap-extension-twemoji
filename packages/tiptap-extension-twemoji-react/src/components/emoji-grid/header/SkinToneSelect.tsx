import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  SKIN_TONE_CODES_ARRAY,
  SKIN_TONE_CODES_PROPS,
  SKIN_TONE_MAP,
} from "@/lib/emoji-utils";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { createFocusTrap } from "focus-trap";
import { LOCAL_STORAGE_SKIN_TONE_KEY } from "@/constants";
import { useClickOutside } from "@/hooks/use-click-outside";

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

const SkinList = ({
  setOpen,
  setSkinTone,
  skinTone,
  toneTriggerRef,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSkinTone: Dispatch<SetStateAction<SKIN_TONE_CODES_PROPS>>;
  skinTone: SKIN_TONE_CODES_PROPS;
  toneTriggerRef: React.RefObject<HTMLButtonElement | null>;
}) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!listRef.current) return undefined;

    const trap = createFocusTrap(listRef.current, {
      escapeDeactivates: false,
      clickOutsideDeactivates: true,
      fallbackFocus: listRef.current,
      returnFocusOnDeactivate: false, // we do this manually
    });

    trap.activate();
    return () => {
      trap.deactivate();
    };
  }, []);

  return (
    <ul
      ref={listRef}
      tabIndex={-1}
      className="flex h-8 outline-none"
      onKeyDownCapture={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          requestAnimationFrame(() => {
            toneTriggerRef.current?.focus();
          });
        }
      }}
    >
      {SKIN_TONE_CODES_ARRAY.map((code, index) => (
        <SkinItem
          setOpen={setOpen}
          key={index}
          code={code}
          setSkinTone={setSkinTone}
          skinTone={skinTone}
          toneTriggerRef={toneTriggerRef}
        />
      ))}
    </ul>
  );
};

const SkinItem = ({
  code,
  setSkinTone,
  skinTone,
  setOpen,
  toneTriggerRef,
}: {
  code: SKIN_TONE_CODES_PROPS;
  setSkinTone: Dispatch<SetStateAction<SKIN_TONE_CODES_PROPS>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  skinTone: SKIN_TONE_CODES_PROPS;
  toneTriggerRef: React.RefObject<HTMLButtonElement | null>;
}) => {
  return (
    <Tooltip delay={200}>
      <li>
        <TooltipTrigger
          onClick={() => {
            localStorage.setItem(LOCAL_STORAGE_SKIN_TONE_KEY, code);
            setSkinTone(code as SKIN_TONE_CODES_PROPS);
            setOpen(false);
            requestAnimationFrame(() => {
              toneTriggerRef.current?.focus();
            });
          }}
          className={cn(
            "size-8 p-1 aspect-square cursor-pointer rounded-md flex justify-center items-center hover:bg-neutral-200 hover:dark:bg-neutral-800",
            code === skinTone && "ring ring-blue-500"
          )}
          autoFocus={code === skinTone}
          draggable={false}
          style={{
            padding: 0,
          }}
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
