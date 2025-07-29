import { Dispatch, SetStateAction, useEffect, useRef, memo } from "react";
import { createFocusTrap } from "focus-trap";
import {
  SKIN_TONE_CODES_ARRAY,
  SKIN_TONE_CODES_PROPS,
} from "@/lib/emoji-utils";
import SkinItem from "./SkinItem";

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
    if (!listRef.current) return;
    const trap = createFocusTrap(listRef.current, {
      escapeDeactivates: false,
      clickOutsideDeactivates: true,
      fallbackFocus: listRef.current,
      returnFocusOnDeactivate: false,
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
      {SKIN_TONE_CODES_ARRAY.map((code) => (
        <SkinItem
          key={code}
          code={code}
          skinTone={skinTone}
          setSkinTone={setSkinTone}
          setOpen={setOpen}
          toneTriggerRef={toneTriggerRef}
        />
      ))}
    </ul>
  );
};

export default memo(SkinList);
