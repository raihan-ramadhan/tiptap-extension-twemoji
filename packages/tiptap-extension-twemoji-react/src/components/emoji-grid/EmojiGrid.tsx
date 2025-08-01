import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { createFocusTrap } from "focus-trap";
import { debounce } from "lodash-es";
import { Plus } from "lucide-react";

// LIB
import { SKIN_TONE_CODES_PROPS } from "@/lib/emoji-utils";
import { cn } from "@/lib/utils";
import {
  getTargetCellVertically,
  getVisibleRowRange,
} from "@/lib/emoji-grid-utils";

// HOOKS
import { useOnKeydownHandlers } from "@/hooks/useOnKeydownHandlers";
import { transformData } from "@/hooks/transformData";

// TYPES
import {
  type SelectedCell,
  type ItemData,
  ComponentEmojiMentionProps,
  SelectedCellElementRef,
} from "@/types";

import {
  CELL_HEIGHT,
  COLUMNS,
  LOCAL_STORAGE_SKIN_TONE_KEY,
  MAX_VISIBLE_ROW,
} from "@/constants";

// COMPONENTS
import { computePosition, autoUpdate, offset, flip } from "@floating-ui/dom";
import AddEmojiBtnWrapper from "@/components/emoji-grid/add-custom-emoji/AddEmojiBtnWrapper";
import EmojiHeader from "@/components/emoji-grid/header/Header";
import Cell from "@/components/emoji-grid/Cell";
import Nav from "@/components/emoji-grid/nav/Nav";

export default function ({
  ref,
  items,
  onCancel,
  onSelectEmoji,
  range,
  query,
  setQuery,
  headerInput,
  callback,
  randomButton,
  removeButton,
  focusImmediately,
  onError,
  onSuccess,
  upload,
  editor,
  onDelete,
  closeAfterDelete,
}: ComponentEmojiMentionProps) {
  const { recent, filteredEmojis, filteredCustomEmojis } = items[0];

  const selectedCellElementRef: SelectedCellElementRef = useRef(null);

  const [selectedCell, setSelectedCell] = useState<SelectedCell>({
    row: 1,
    column: 0,
  });
  const selectedCellRef = useRef<SelectedCell>(selectedCell);

  const outerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<Grid<ItemData>>(null);

  const MINIMUM_CELL_SHOW_GROUPS = 60;

  const [keyboardEnabled, setKeyboardEnabled] = useState(true);

  const [skinTone, setSkinTone] = useState<SKIN_TONE_CODES_PROPS>(() => {
    // Runs only on client
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem(
          LOCAL_STORAGE_SKIN_TONE_KEY
        ) as SKIN_TONE_CODES_PROPS) || "default"
      );
    }
    return "default";
  });

  const { arr2d, groupsIndexes } = useMemo(() => {
    setSelectedCell({ row: 1, column: 0 });
    requestAnimationFrame(() => {
      if (gridRef.current) {
        gridRef.current.scrollTo({
          scrollLeft: 0,
          scrollTop: 0,
        });
      }
    });
    return transformData({
      filteredCustomEmojis,
      COLUMNS,
      recent,
      filteredEmojis,
      MINIMUM_CELL_SHOW_GROUPS,
    });
  }, [recent, filteredEmojis, filteredCustomEmojis]);

  // max height between the total height of the grid and the max visible row
  // the purpose to have dynamic height by setting the max height (MAX_VISIBLE_ROW * CELL_HEIGHT)
  const heightList = Math.min(
    arr2d.length * CELL_HEIGHT,
    MAX_VISIBLE_ROW * CELL_HEIGHT
  );
  const widthGrid = COLUMNS * CELL_HEIGHT + 12; // 8 for scrollbar width and 4 for manual padding-right

  useEffect(() => {
    selectedCellRef.current = selectedCell;
  }, [selectedCell]);

  // Debounced handler for scroll stop
  const handleScrollStop = useCallback(
    debounce(() => {
      const { endRow, startRow } = getVisibleRowRange({
        CELL_HEIGHT,
        gridRef,
        outerRef,
      });

      if (selectedCellRef.current.row < startRow) {
        setSelectedCell((prev) => {
          const targetCell = getTargetCellVertically({
            direction: "down",
            selectedCell: { ...prev, row: startRow - 1 }, //
            arr2d,
          });
          return targetCell;
        });
      } else if (selectedCellRef.current.row > endRow) {
        setSelectedCell((prev) => {
          const targetCell = getTargetCellVertically({
            direction: "up",
            selectedCell: { ...prev, row: endRow + 1 },
            arr2d,
          });

          return targetCell;
        });
      }
    }, 150),
    []
  );

  useEffect(() => {
    if (!outerRef.current) return;

    const handleScroll = () => {
      handleScrollStop(); // call the debounced function
    };

    outerRef.current.addEventListener("scroll", handleScroll);

    return () => {
      outerRef.current?.removeEventListener("scroll", handleScroll);
      handleScrollStop.cancel(); // cancel debounce on cleanup
    };
  }, [handleScrollStop]);

  const trapRef = useRef<HTMLDivElement | null>(null);
  const focusTrap = useRef<ReturnType<typeof createFocusTrap> | null>(null);

  useEffect(() => {
    if (!trapRef.current) return;

    const trap = createFocusTrap(trapRef.current, {
      fallbackFocus: trapRef.current,
      allowOutsideClick: () => true,
      clickOutsideDeactivates: true,
      escapeDeactivates: false,
      returnFocusOnDeactivate: true,
    });

    focusTrap.current = trap;
    if (focusImmediately) trap.activate();

    // ✅ disable trap on outside mouse click
    const handleMouseDown = (e: MouseEvent) => {
      if (!trapRef.current?.contains(e.target as Node)) {
        trap.deactivate();
      }
    };

    // ✅ Reactivate when Tab is pressed
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (!focusTrap.current?.active) {
          trap.activate();
        }
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      trap.deactivate();
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activateTrap = () => {
    focusTrap.current?.activate();
  };

  const deactivateTrap = () => {
    focusTrap.current?.deactivate();
  };

  // handle keydown event globally for arrows, enter, escape,
  // and handle useImperativeHandle from tiptap onKeyDown props
  useOnKeydownHandlers({
    MAX_VISIBLE_ROW,
    CELL_HEIGHT,
    COLUMNS,
    arr2d,
    selectedCellRef,
    ref,
    gridRef,
    outerRef,
    onSelectEmoji,
    setSelectedCell,
    skinTone,
    range,
    keyboardEnabled,
    selectedCellElementRef,
    activateTrap,
    deactivateTrap,
  });

  const toastRef = useRef<{
    element: HTMLDivElement | null;
    cleanup: (() => void) | null;
    timeoutId: number | null;
  }>({
    element: null,
    cleanup: null,
    timeoutId: null,
  });

  function showToastAboveTrap(
    trapEl: HTMLElement,
    message: string,
    toastRef: React.RefObject<{
      element: HTMLDivElement | null;
      cleanup: (() => void) | null;
      timeoutId: number | null;
    }>
  ) {
    // Clear existing toast
    if (toastRef.current.element) {
      toastRef.current.cleanup?.();
      clearTimeout(toastRef.current.timeoutId!);
      toastRef.current.element.remove();
      toastRef.current.element = null;
      toastRef.current.cleanup = null;
      toastRef.current.timeoutId = null;
    }

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className =
      "bg-black/50 text-white px-3 py-2 rounded shadow transition-opacity duration-300 opacity-100 pointer-events-none z-50 absolute";

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
      setTimeout(() => {
        cleanup();
        toast.remove();
        toastRef.current.element = null;
        toastRef.current.cleanup = null;
        toastRef.current.timeoutId = null;
      }, 300);
    }, 2000);

    // Save references
    toastRef.current.element = toast;
    toastRef.current.cleanup = cleanup;
    toastRef.current.timeoutId = timeoutId;
  }

  const dismissToast = () => {
    if (toastRef.current.element) {
      toastRef.current.cleanup?.();
      clearTimeout(toastRef.current.timeoutId!);
      toastRef.current.element.remove();
      toastRef.current.element = null;
      toastRef.current.cleanup = null;
      toastRef.current.timeoutId = null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        requestAnimationFrame(() => {
          const activeEl = document.activeElement as HTMLElement;
          if (activeEl?.hasAttribute("data-selected-cell") && trapRef.current) {
            showToastAboveTrap(trapRef.current, "Move ⬅️⬆️⬇️➡️", toastRef);
          } else {
            dismissToast();
          }
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const cellRefs = useRef<Map<string, HTMLDivElement | HTMLButtonElement>>(
    new Map()
  );

  const debouncedSetSelectedCell = useCallback(
    debounce((row: number, col: number) => {
      setSelectedCell({ row, column: col });

      const key = `${row}-${col}`;
      const currentEl = cellRefs.current.get(key);
      if (currentEl) {
        currentEl.focus();
      }
      requestAnimationFrame(() => {
        activateTrap();
      });
    }, 150),
    [selectedCellElementRef.current, outerRef.current]
  );

  let prevKey = `${selectedCell.row}-${selectedCell.column}`;

  const handleHover = (row: number, col: number) => {
    deactivateTrap();
    const key = `${row}-${col}`;
    if (key === prevKey) return;

    const prevEl = cellRefs.current.get(prevKey);
    if (prevEl) {
      prevEl.classList.remove("dark:bg-neutral-800");
      prevEl.classList.remove("bg-neutral-200");
    }

    const currentEl = cellRefs.current.get(key);
    if (currentEl) {
      currentEl.classList.add("dark:bg-neutral-800");
      currentEl.classList.add("bg-neutral-200");
    }

    prevKey = key;
    debouncedSetSelectedCell.cancel();
    debouncedSetSelectedCell(row, col);
  };

  useEffect(() => {
    return () => {
      debouncedSetSelectedCell.cancel();
    };
  }, [debouncedSetSelectedCell]);

  useEffect(() => {
    return () => {
      cellRefs.current.clear();
    };
  }, []);

  useEffect(() => {
    return () => {
      //return the cursor at the last known position at editor
      editor?.commands.focus();
    };
  }, []);

  return (
    <div
      tabIndex={-1}
      ref={(node) => {
        trapRef.current = node;
      }}
    >
      <EmojiHeader
        onCancel={onCancel}
        callback={callback}
        filteredEmojis={items[0].filteredEmojis}
        headerInput={headerInput}
        setSkinTone={setSkinTone}
        skinTone={skinTone}
        query={query}
        setQuery={setQuery}
        randomButton={randomButton}
        removeButton={removeButton}
        onDelete={onDelete}
        closeAfterDelete={closeAfterDelete}
      />
      {filteredEmojis.length +
        (recent?.length ?? 0) +
        (filteredCustomEmojis?.length ?? 0) >
      0 ? (
        <>
          <Grid
            className="ml-[4px] scrollbar-thin scrollbar-thumb-[#eeeef6] dark:scrollbar-thumb-[#25272d] !overflow-x-hidden scrollbar-track-transparent"
            ref={gridRef}
            width={widthGrid}
            height={heightList}
            outerRef={outerRef}
            overscanRowCount={5}
            columnCount={COLUMNS}
            rowHeight={CELL_HEIGHT}
            rowCount={arr2d.length}
            columnWidth={CELL_HEIGHT}
            itemData={{
              range,
              skinTone,
              arr2d,
              onSelectEmoji,
              selectedCell,
              selectedCellElementRef,
              setKeyboardEnabled,
              cellRefs,
              handleHover,
              onError,
              onSuccess,
              upload,
            }}
          >
            {Cell}
          </Grid>
          {filteredEmojis.length + (filteredCustomEmojis?.length ?? 0) >
          MINIMUM_CELL_SHOW_GROUPS ? (
            <Nav
              onSuccess={onSuccess}
              onError={onError}
              upload={upload}
              setKeyboardEnabled={setKeyboardEnabled}
              arr2d={arr2d}
              width={widthGrid}
              outerRef={outerRef}
              navItemWidth={CELL_HEIGHT}
              gridRef={gridRef}
              groupsIndexes={groupsIndexes}
            />
          ) : null}
        </>
      ) : (
        <div
          className="h-full text-nowrap text-xs font-medium flex items-center justify-between pl-1"
          style={{ width: widthGrid, height: CELL_HEIGHT }}
        >
          <span>No Result</span>
          <AddEmojiBtnWrapper
            onSuccess={onSuccess}
            onErrorUpload={onError}
            upload={upload}
            onMount={() => setKeyboardEnabled(false)}
            onUnmount={() => setKeyboardEnabled(true)}
            className={cn(
              "relative inset-0 h-full px-2 cursor-pointer inline-flex items-center rounded-full justify-center ring-inset ring-[1px] ring-neutral-400 dark:ring-neutral-600 outline-none border-[1px] border-black hover:bg-neutral-800"
            )}
          >
            <span className="flex items-center text-base px-2">
              <Plus /> <span> Add Emoji</span>
            </span>
          </AddEmojiBtnWrapper>
        </div>
      )}
    </div>
  );
}
