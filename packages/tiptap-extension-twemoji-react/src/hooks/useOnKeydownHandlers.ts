import { useEffect, useImperativeHandle } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { Emoji } from "@/data/emoji-sprite-map";
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
} from "@/lib/emoji-grid-utils";
import {
  ARRAY2D_ITEM_PROPS,
  SelectedCell,
  EmojiListRef,
  ItemData,
  SelectEmojiFunc,
  SelectedCellElementRef,
} from "@/types";
import { SKIN_TONE_CODES_PROPS, SKIN_TONE_MAP } from "@/lib/emoji-utils";
import { SuggestionProps } from "@tiptap/suggestion";
import { MentionNodeAttrs } from "@tiptap/extension-mention";

interface OnKeydownHandlersProps {
  onSelectEmoji: SelectEmojiFunc;
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCell>>;
  selectedCellRef: React.RefObject<SelectedCell>;
  outerRef: React.RefObject<HTMLDivElement | null>;
  gridRef: React.RefObject<Grid<ItemData> | null>;
  ref: React.Ref<EmojiListRef> | undefined;
  arr2d: ARRAY2D_ITEM_PROPS[];
  MAX_VISIBLE_ROW: number;
  CELL_HEIGHT: number;
  COLUMNS: number;
  skinTone: SKIN_TONE_CODES_PROPS;
  range?: SuggestionProps<any, MentionNodeAttrs>["range"];
  keyboardEnabled: boolean;
  selectedCellElementRef: SelectedCellElementRef;
  deactivateTrap: () => void;
  activateTrap: () => void;
}

export function useOnKeydownHandlers({
  outerRef,
  gridRef,
  setSelectedCell,
  arr2d,
  CELL_HEIGHT,
  MAX_VISIBLE_ROW,
  onSelectEmoji,
  selectedCellRef,
  COLUMNS,
  ref,
  skinTone,
  range,
  keyboardEnabled,
  selectedCellElementRef,
  activateTrap,
  deactivateTrap,
}: OnKeydownHandlersProps) {
  const sharedScrollParams = {
    gridRef,
    outerRef,
    CELL_HEIGHT,
    MAX_VISIBLE_ROW,
    arr2d,
  };

  const upHandler = () => {
    if (selectedCellRef.current.row === 1) {
      return scrollGridByRows({
        direction: "up",
        rowMultiplier: 1,
        ...sharedScrollParams,
      });
    }

    setSelectedCell((prev) => {
      const targetCell = getTargetCellVertically({
        direction: "up",
        selectedCell: prev,
        ...sharedScrollParams,
      });

      if (
        checkIfScrollingUp({
          gridRef,
          targetRow: targetCell.row,
          CELL_HEIGHT,
          outerRef,
        })
      ) {
        const rowsToScroll = getNumberOfRowsToScrollUp({
          gridRef,
          targetRow: targetCell.row,
          CELL_HEIGHT,
          outerRef,
        });

        scrollGridByRows({
          direction: "up",
          rowMultiplier: rowsToScroll,
          ...sharedScrollParams,
        });
      }

      return targetCell;
    });
  };

  const downHandler = () => {
    setSelectedCell((prev) => {
      const targetCell = getTargetCellVertically({
        direction: "down",
        selectedCell: prev,
        ...sharedScrollParams,
      });

      if (
        checkIfScrollingDown({
          gridRef,
          targetRow: targetCell.row,
          CELL_HEIGHT,
          outerRef,
        })
      ) {
        const rowsToScroll = getNumberOfRowsToScrollDown({
          gridRef,
          targetRow: targetCell.row,
          CELL_HEIGHT,
          outerRef,
        });

        scrollGridByRows({
          direction: "down",
          rowMultiplier: rowsToScroll,
          ...sharedScrollParams,
        });
      }

      return targetCell;
    });
  };

  const leftHandler = () => {
    setSelectedCell((prev) =>
      getTargetCellHorizontally({
        direction: "left",
        currentSelectedCell: prev,
        COLUMNS,
        ...sharedScrollParams,
      })
    );
  };

  const rightHandler = () => {
    setSelectedCell((prev) =>
      getTargetCellHorizontally({
        direction: "right",
        currentSelectedCell: prev,
        COLUMNS,
        ...sharedScrollParams,
      })
    );
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
    } else if (data && typeof data === "object" && "buttonLabel" in data) {
      selectedCellElementRef.current?.click();
    }
  };

  const tabHandler = (event: KeyboardEvent) => {
    event.preventDefault();
  };

  // only run if user still focus at editor
  useImperativeHandle(ref, () => {
    return {
      onKeyDown: ({ event }) => {
        const keyMap: Record<string, () => void> = {
          Enter: () => enterHandler(event, skinTone),
          Tab: () => tabHandler(event),
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

  useEffect(() => {
    if (!keyboardEnabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, () => void> = {
        ArrowUp: upHandler,
        ArrowDown: downHandler,
        ArrowLeft: leftHandler,
        ArrowRight: rightHandler,
        Enter: () => enterHandler(event, skinTone),
      };

      const handler = keyMap[event.key];
      if (handler) {
        event.preventDefault();
        event.stopPropagation();
        handler();
        deactivateTrap();
        requestAnimationFrame(() => {
          selectedCellElementRef.current?.focus();
          activateTrap();
        });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [arr2d, keyboardEnabled]);
}
