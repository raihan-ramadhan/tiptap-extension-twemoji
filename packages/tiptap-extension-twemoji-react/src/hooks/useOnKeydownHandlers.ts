import "./hooks-ui.scss";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import {
  getNumberOfRowsToScrollDown,
  getNumberOfRowsToScrollUp,
  getTargetCellHorizontally,
  getTargetCellVertically,
  checkIfScrollingDown,
  checkIfScrollingUp,
  scrollGridByRows,
  isEmoji,
  isCustomEmoji,
  isActionBtn,
} from "@/lib/emoji-grid-utils";
import {
  ARRAY2D_ITEM_PROPS,
  SelectedCell,
  EmojiListRef,
  ItemData,
  SelectEmojiFunc,
  SelectedCellElementRef,
  Emoji,
} from "@/types";
import { SKIN_TONE_CODES_PROPS, SKIN_TONE_MAP } from "@/lib/emoji-utils";
import { SuggestionProps } from "@tiptap/suggestion";
import { MentionNodeAttrs } from "@tiptap/extension-mention";

import { computePosition, autoUpdate, offset, flip } from "@floating-ui/dom";
import { debounce } from "lodash-es";

type ToastRef = {
  element: HTMLDivElement | null;
  cleanup: (() => void) | null;
  timeoutId: number | null;
};

interface OnKeydownHandlersProps {
  onSelectEmoji: SelectEmojiFunc;
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCell>>;
  selectedCellRef: React.RefObject<SelectedCell>;
  outerRef: React.RefObject<HTMLDivElement | null>;
  gridRef: React.RefObject<Grid<ItemData> | null>;
  ref: React.Ref<EmojiListRef> | undefined;
  arr2d: ARRAY2D_ITEM_PROPS[];
  visibleRows: number;
  cellSize: number;
  COLUMNS: number;
  skinTone: SKIN_TONE_CODES_PROPS;
  range?: SuggestionProps<any, MentionNodeAttrs>["range"];
  selectedCellElementRef: SelectedCellElementRef;
  deactivateTrap: () => void;
  activateTrap: () => void;
  trapRef: React.RefObject<HTMLDivElement | null>;
  onCancel: () => void;
  disabledFocusAndEvent?: boolean;
}

export function useOnKeydownHandlers({
  outerRef,
  gridRef,
  setSelectedCell,
  arr2d,
  cellSize,
  visibleRows,
  onSelectEmoji,
  selectedCellRef,
  COLUMNS,
  ref,
  skinTone,
  range,
  selectedCellElementRef,
  activateTrap,
  deactivateTrap,
  trapRef,
  onCancel,
  disabledFocusAndEvent,
}: OnKeydownHandlersProps) {
  const sharedScrollParams = {
    gridRef,
    outerRef,
    cellSize,
    visibleRows,
    arr2d,
  };

  const [isActive, setIsActive] = useState(true);

  const disableEmojiCellsNavigation = () => {
    setIsActive(false);
  };
  const enableEmojiCellsNavigation = () => {
    setIsActive(true);
  };

  const upHandler = () => {
    if (selectedCellRef.current.row === 1) {
      requestAnimationFrame(() => {
        scrollGridByRows({
          direction: "up",
          rowMultiplier: 1,
          ...sharedScrollParams,
        });
      });
      return;
    }

    let targetCell = selectedCellRef.current;
    let rowsToScroll = 0;

    setSelectedCell((prev) => {
      targetCell = getTargetCellVertically({
        direction: "up",
        selectedCell: prev,
        ...sharedScrollParams,
      });

      if (
        checkIfScrollingUp({
          gridRef,
          targetRow: targetCell.row,
          cellSize,
          outerRef,
        })
      ) {
        rowsToScroll = getNumberOfRowsToScrollUp({
          gridRef,
          targetRow: targetCell.row,
          cellSize,
          outerRef,
        });
      }

      return targetCell;
    });

    requestAnimationFrame(() => {
      scrollGridByRows({
        direction: "up",
        rowMultiplier: rowsToScroll,
        ...sharedScrollParams,
      });
    });
  };

  const downHandler = () => {
    let targetCell = selectedCellRef.current; // fallback
    let rowsToScroll = 0;

    // Update selected cell without doing side-effects
    setSelectedCell((prev) => {
      targetCell = getTargetCellVertically({
        direction: "down",
        selectedCell: prev,
        ...sharedScrollParams,
      });

      if (
        checkIfScrollingDown({
          gridRef,
          targetRow: targetCell.row,
          cellSize,
          outerRef,
        })
      ) {
        rowsToScroll = getNumberOfRowsToScrollDown({
          gridRef,
          targetRow: targetCell.row,
          cellSize,
          outerRef,
        });
      }

      return targetCell;
    });

    requestAnimationFrame(() => {
      scrollGridByRows({
        direction: "down",
        rowMultiplier: rowsToScroll,
        ...sharedScrollParams,
      });
    });
  };

  const leftHandler = () => {
    let rowsToScroll = 0;

    setSelectedCell((prev) => {
      const { cell, targetRowsToScroll } = getTargetCellHorizontally({
        direction: "left",
        currentSelectedCell: prev,
        COLUMNS,
        ...sharedScrollParams,
      });

      if (targetRowsToScroll) rowsToScroll = targetRowsToScroll;

      return cell;
    });

    requestAnimationFrame(() => {
      scrollGridByRows({
        direction: "up",
        rowMultiplier: rowsToScroll,
        ...sharedScrollParams,
      });
    });
  };

  const rightHandler = () => {
    let rowsToScroll = 0;

    setSelectedCell((prev) => {
      const { cell, targetRowsToScroll } = getTargetCellHorizontally({
        direction: "right",
        currentSelectedCell: prev,
        COLUMNS,
        ...sharedScrollParams,
      });

      if (targetRowsToScroll) rowsToScroll = targetRowsToScroll;

      return cell;
    });

    requestAnimationFrame(() => {
      scrollGridByRows({
        direction: "down",
        rowMultiplier: rowsToScroll,
        ...sharedScrollParams,
      });
    });
  };

  const enterHandler = (
    event: KeyboardEvent,
    skinTone: SKIN_TONE_CODES_PROPS
  ) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    const { row, column } = selectedCellRef.current;
    const data = arr2d[row]?.[column];

    const tone: string = SKIN_TONE_MAP[skinTone].tone;

    if (isEmoji(data)) {
      const { skins } = data;

      let newEmoji = data;

      if (skinTone && skinTone !== "default" && skins && skins[tone]) {
        newEmoji = skins[tone] as Emoji;
      }
      onSelectEmoji({ emoji: newEmoji, baseHexcode: data.hexcode, range });
    } else if (isCustomEmoji(data)) {
      onSelectEmoji({
        emoji: data,
        range,
      });
    } else if (isActionBtn(data)) {
      selectedCellElementRef.current?.click();
    }
  };

  // only run if user still focus at editor
  useImperativeHandle(ref, () => {
    return {
      onKeyDown: ({ event }) => {
        const keyMap: Record<string, () => void> = {
          Enter: () => enterHandler(event, skinTone),
          Tab: () => {
            event.preventDefault();
            activateTrap();
          },
        };

        const handler = keyMap[event.key];
        if (handler) {
          handler();
          return true;
        }

        return false;
      },
    };
  });

  const toastRef = useRef<ToastRef>({
    element: null,
    cleanup: null,
    timeoutId: null,
  });

  function clearToast(ref: React.MutableRefObject<ToastRef>) {
    const { element, cleanup, timeoutId } = ref.current;
    if (element) {
      cleanup?.();
      clearTimeout(timeoutId!);
      element.remove();
      ref.current.element = null;
      ref.current.cleanup = null;
      ref.current.timeoutId = null;
    }
  }

  const dismissToast = () => clearToast(toastRef);

  const showToastAboveTrap = (
    trapEl: HTMLElement,
    message: string,
    ref = toastRef
  ) => {
    clearToast(ref);

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = "navigation-hint-toast";

    document.body.appendChild(toast);

    const cleanup = autoUpdate(trapEl, toast, () => {
      computePosition(trapEl, toast, {
        placement: "top",
        middleware: [offset(8), flip({ fallbackPlacements: ["bottom"] })],
      }).then(({ x, y }) => {
        Object.assign(toast.style, {
          left: `${x}px`,
          top: `${y}px`,
          position: "absolute",
        });
      });
    });

    const timeoutId = window.setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => clearToast(ref), 500);
    }, 2000);

    ref.current = { element: toast, cleanup, timeoutId };
  };

  const debouncedShowToastAboveTrap = debounce(showToastAboveTrap, 100);

  const tabHandler = () => {
    requestAnimationFrame(() => {
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl?.hasAttribute("data-selected-cell") && trapRef.current) {
        debouncedShowToastAboveTrap(trapRef.current, "Move ⬅️⬆️⬇️➡️", toastRef);
      } else {
        dismissToast();
      }
    });
  };

  useEffect(() => {
    return () => {
      dismissToast();
    };
  }, []);

  useEffect(() => {
    if (!isActive || disabledFocusAndEvent) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, () => void> = {
        ArrowUp: upHandler,
        ArrowDown: downHandler,
        ArrowLeft: leftHandler,
        ArrowRight: rightHandler,
        Tab: tabHandler,
        Enter: () => enterHandler(event, skinTone),
        Escape: () => onCancel(),
      };

      const handler = keyMap[event.key];
      if (handler) {
        handler();
        if (event.key !== "Tab" && event.key !== "Enter") {
          event.preventDefault();
          event.stopPropagation();
          deactivateTrap();
          requestAnimationFrame(() => {
            selectedCellElementRef.current?.focus();
            activateTrap();
          });
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [arr2d, isActive, disabledFocusAndEvent]);

  return {
    enableEmojiCellsNavigation,
    disableEmojiCellsNavigation,
  };
}
