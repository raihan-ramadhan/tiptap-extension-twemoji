import { useEffect, RefObject } from "react";

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void
): void {
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [ref, callback]);
}
