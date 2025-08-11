import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { createFocusTrap } from "focus-trap";
import { debounce } from "lodash-es";
import { Plus } from "lucide-react";

// LIB
import { SKIN_TONE_CODES_PROPS } from "@/lib/emoji-utils";
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

import { COLUMNS, LOCAL_STORAGE_SKIN_TONE_KEY } from "@/constants";

// COMPONENTS
import AddCustomEmoji from "@/components/emoji-grid/add-custom-emoji/AddCustomEmoji";
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
  randomButton,
  removeButton,
  focusImmediately,
  onError,
  onSuccess,
  upload,
  editor,
  onDelete,
  closeAfterDelete,
  accept,
  maxSize,
  skinToneSelect,
  minCellsToHideNav,
  cellSize,
  visibleRows,
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
      minCellsToHideNav,
    });
  }, [recent, filteredEmojis, filteredCustomEmojis]);

  // max height between the total height of the grid and the max visible row
  // the purpose to have dynamic height by setting the max height (visibleRows * cellSize)
  const heightList = Math.min(arr2d.length * cellSize, visibleRows * cellSize);
  const widthGrid = COLUMNS * cellSize + 12; // 8 for scrollbar width and 4 for manual padding-right

  useEffect(() => {
    selectedCellRef.current = selectedCell;
  }, [selectedCell]);

  // Debounced handler for scroll stop
  const handleScrollStop = useCallback(
    debounce(() => {
      const { endRow, startRow } = getVisibleRowRange({
        cellSize,
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

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      trap.deactivate();
      document.removeEventListener("mousedown", handleMouseDown);
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
  const { disableEmojiCellsNavigation, enableEmojiCellsNavigation } =
    useOnKeydownHandlers({
      visibleRows,
      cellSize,
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
      selectedCellElementRef,
      activateTrap,
      deactivateTrap,
      trapRef,
    });

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
      {randomButton || headerInput || removeButton || skinToneSelect ? (
        <EmojiHeader
          onSkinListUnmount={enableEmojiCellsNavigation}
          onSkinListMount={disableEmojiCellsNavigation}
          filteredEmojis={items[0].filteredEmojis}
          onCancel={onCancel}
          setSkinTone={setSkinTone}
          skinTone={skinTone}
          query={query}
          setQuery={setQuery}
          headerInput={headerInput}
          randomButton={randomButton}
          removeButton={removeButton}
          onDelete={onDelete}
          closeAfterDelete={closeAfterDelete}
          skinToneSelect={skinToneSelect}
          onSelectEmoji={onSelectEmoji}
          cellSize={cellSize}
          range={range}
        />
      ) : null}
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
            rowHeight={cellSize}
            rowCount={arr2d.length}
            columnWidth={cellSize}
            itemData={{
              disableEmojiCellsNavigation,
              enableEmojiCellsNavigation,
              selectedCellElementRef,
              deactivateTrap,
              onSelectEmoji,
              selectedCell,
              activateTrap,
              handleHover,
              onSuccess,
              skinTone,
              cellRefs,
              cellSize,
              onError,
              maxSize,
              upload,
              accept,
              range,
              arr2d,
            }}
          >
            {Cell}
          </Grid>
          <Nav
            maxSize={maxSize}
            accept={accept}
            onSuccess={onSuccess}
            onError={onError}
            upload={upload}
            disableEmojiCellsNavigation={() => {
              deactivateTrap();
              disableEmojiCellsNavigation();
            }}
            enableEmojiCellsNavigation={() => {
              activateTrap();
              enableEmojiCellsNavigation();
            }}
            arr2d={arr2d}
            width={widthGrid}
            outerRef={outerRef}
            navItemWidth={cellSize}
            gridRef={gridRef}
            groupsIndexes={groupsIndexes}
            className={
              filteredEmojis.length + (filteredCustomEmojis?.length ?? 0) >
              minCellsToHideNav
                ? "sticky"
                : "hidden"
            }
          />
        </>
      ) : (
        <div
          className="text-nowrap text-xs font-medium p-1"
          style={{ width: widthGrid }}
        >
          <span className="block py-2">No Result</span>
          <div>
            <AddCustomEmoji
              accept={accept}
              className="twemoji-button w-fit twemoji-border relative inline-flex items-center justify-center !py-1 !px-2"
              onSubPopoverMount={() => {
                deactivateTrap();
                disableEmojiCellsNavigation();
              }}
              onSubPopoverUnmount={() => {
                activateTrap();
                enableEmojiCellsNavigation();
              }}
              onMount={disableEmojiCellsNavigation}
              onUnmount={enableEmojiCellsNavigation}
              onErrorUpload={onError}
              onSuccess={onSuccess}
              upload={upload}
              maxSize={maxSize}
            >
              <span className="flex items-center gap-0.5 text-xs">
                <Plus className="size-4 aspect-square stroke-(length:--twemoji-icon-stroke-width)" />
                <span> Add Emoji</span>
              </span>
            </AddCustomEmoji>
          </div>
        </div>
      )}
    </div>
  );
}
