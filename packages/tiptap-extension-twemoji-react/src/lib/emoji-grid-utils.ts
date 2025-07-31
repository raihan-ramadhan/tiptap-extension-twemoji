import { Emoji } from "@/data/emoji-sprite-map";
import {
  ActionBtn,
  ARRAY2D_ITEM_PROPS,
  CELL_TYPES,
  CustomEmoji,
  GroupTitle,
  ItemData,
  SelectedCell,
} from "@/types";
import { FixedSizeGrid as Grid } from "react-window";

export const scrollGridByRows = ({
  direction,
  rowMultiplier,
  gridRef,
  outerRef,
  CELL_HEIGHT,
  MAX_VISIBLE_ROW,
  arr2d,
}: {
  direction: "up" | "down";
  rowMultiplier: number;
  gridRef: React.RefObject<Grid<ItemData> | null>;
  outerRef: React.RefObject<HTMLDivElement | null>;
  MAX_VISIBLE_ROW: number;
  CELL_HEIGHT: number;
  arr2d: ARRAY2D_ITEM_PROPS[];
}) => {
  if (!gridRef.current) return;

  const currentTop = outerRef.current?.scrollTop || 0;

  const isMisaligned = currentTop % CELL_HEIGHT !== 0;
  const alignedTop = isMisaligned
    ? currentTop - (currentTop % CELL_HEIGHT) + CELL_HEIGHT
    : currentTop;

  const scrollOffset = CELL_HEIGHT * rowMultiplier;

  const targetTop =
    direction === "down"
      ? alignedTop + scrollOffset
      : alignedTop - scrollOffset;

  const maxScrollTop =
    arr2d.length * CELL_HEIGHT - MAX_VISIBLE_ROW * CELL_HEIGHT;

  gridRef.current.scrollTo({
    scrollLeft: 0,
    scrollTop:
      direction === "down"
        ? Math.min(targetTop, maxScrollTop)
        : Math.max(targetTop, 0),
  });
};

export const checkIfScrollingDown = ({
  gridRef,
  targetRow,
  CELL_HEIGHT,
  outerRef,
}: {
  gridRef: React.RefObject<Grid<ItemData> | null>;
  targetRow: number;
  CELL_HEIGHT: number;
  outerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (!gridRef.current) return false;

  const { scrollTop, clientHeight } = outerRef.current || {
    scrollTop: 0,
    clientHeight: 0,
  };

  const bottomPixel = scrollTop + clientHeight;

  return targetRow * CELL_HEIGHT > bottomPixel - CELL_HEIGHT;
};

export const checkIfScrollingUp = ({
  gridRef,
  targetRow,
  CELL_HEIGHT,
  outerRef,
}: {
  gridRef: React.RefObject<Grid<ItemData> | null>;
  targetRow: number;
  CELL_HEIGHT: number;
  outerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (!gridRef.current) return false;

  const { scrollTop } = outerRef.current || {
    scrollTop: 0,
    clientHeight: 0,
  };

  const topPixel = scrollTop;

  return targetRow * CELL_HEIGHT < topPixel;
};

export const getNumberOfRowsToScrollDown = ({
  targetRow,
  gridRef,
  CELL_HEIGHT,
  outerRef,
}: {
  targetRow: number;
  gridRef: React.RefObject<Grid<ItemData> | null>;
  CELL_HEIGHT: number;
  outerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (!gridRef.current) return 0;

  const { scrollTop, clientHeight } = outerRef.current || {
    scrollTop: 0,
    clientHeight: 0,
  };

  const viewportBottom = scrollTop + clientHeight;
  const targetRowBottom = (targetRow + 1) * CELL_HEIGHT;
  const overflowPixels = targetRowBottom - viewportBottom;

  return Math.floor(overflowPixels / CELL_HEIGHT);
};

export const getNumberOfRowsToScrollUp = ({
  targetRow,
  gridRef,
  CELL_HEIGHT,
  outerRef,
}: {
  targetRow: number;
  gridRef: React.RefObject<Grid<ItemData> | null>;
  CELL_HEIGHT: number;
  outerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (!gridRef.current) return 0;

  const { scrollTop } = outerRef.current || {
    scrollTop: 0,
    clientHeight: 0,
  };

  const viewportTop = scrollTop;
  const targetRowTop = targetRow * CELL_HEIGHT;
  const overflowPixels = viewportTop - targetRowTop;

  return Math.floor(overflowPixels / CELL_HEIGHT);
};

export const isEmoji = (cell: CELL_TYPES): cell is Emoji =>
  !!cell && typeof cell === "object" && "emoji" in cell;

export const isCustomEmoji = (cell: CELL_TYPES): cell is CustomEmoji =>
  !!cell && typeof cell === "object" && "id" in cell;

export const isActionBtn = (cell: CELL_TYPES): cell is ActionBtn =>
  !!cell && typeof cell === "object" && "buttonLabel" in cell;

export const isGroupTitle = (cell: CELL_TYPES): cell is GroupTitle =>
  !!cell && typeof cell === "object" && "groupTitle" in cell;

export const isValidCell = (
  cell: CELL_TYPES
): cell is Emoji | CustomEmoji | ActionBtn =>
  !!cell &&
  typeof cell === "object" &&
  ("label" in cell || "url" in cell || "buttonLabel" in cell);

export function findLastStringIndex(arr: ARRAY2D_ITEM_PROPS) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (isValidCell(arr[i])) return i;
  }
  return -1;
}

export const getTargetCellVertically: (props: {
  selectedCell: SelectedCell;
  direction: "up" | "down";
  arr2d: ARRAY2D_ITEM_PROPS[];
}) => SelectedCell = ({ direction, selectedCell, arr2d }) => {
  const offset = direction === "up" ? -1 : 1;

  const nextCell = (targetIndexJump: number) => {
    let newRow = selectedCell.row;
    newRow += targetIndexJump;

    return arr2d[newRow]?.[selectedCell.column];
  };

  // for normal condition move to next cell 1 level top or bottom
  if (isValidCell(nextCell(offset))) {
    return {
      row: selectedCell.row + offset,
      column: selectedCell.column,
    };
  }
  // check if 2 level cell at top or bottom have emoji, if emoji found then move there
  if (isValidCell(nextCell(offset * 2))) {
    return {
      row: selectedCell.row + offset * 2,
      column: selectedCell.column,
    };
  }
  // check if 3 level cell at top or bottom have emoji, if emoji found then move there
  if (isValidCell(nextCell(offset * 3))) {
    return {
      row: selectedCell.row + offset * 3,
      column: selectedCell.column,
    };
  }

  // this only for one condition, when user at the 1 level at end of list,
  // and try go down, there is list of array emoji but not directly bottom of current selected cell,
  // so we need get position of last emoji of that array
  if (isValidCell(arr2d[selectedCell.row + offset]?.[0])) {
    return {
      row: selectedCell.row + offset,
      column: findLastStringIndex(arr2d[selectedCell.row + offset]),
    };
  }

  // This happens when the user tries to move to a row that contains emojis,
  // but the target position is undefined. This can occur when the desired row
  // is not directly one or two rows above or below the current position.
  // In such cases, we need to find the position of the last emoji in that row
  // to ensure proper navigation.
  if (isValidCell(arr2d[selectedCell.row + offset * 2]?.[0])) {
    return {
      row: selectedCell.row + offset * 2,
      column: findLastStringIndex(arr2d[selectedCell.row + offset * 2]),
    };
  }

  return {
    row: selectedCell.row,
    column: selectedCell.column,
  };
};

export const getTargetCellHorizontally: (props: {
  currentSelectedCell: SelectedCell;
  direction: "left" | "right";
  arr2d: ARRAY2D_ITEM_PROPS[];
  gridRef: React.RefObject<Grid<ItemData> | null>;
  outerRef: React.RefObject<HTMLDivElement | null>;
  CELL_HEIGHT: number;
  MAX_VISIBLE_ROW: number;
  COLUMNS: number;
}) => { cell: SelectedCell; targetRowsToScroll?: number } = ({
  direction,
  currentSelectedCell,
  CELL_HEIGHT,
  MAX_VISIBLE_ROW,
  arr2d,
  gridRef,
  outerRef,
  COLUMNS,
}) => {
  let targetRowsToScroll = 0;

  // this to decide want to go prev or next column
  const targetCell = ({ row, column }: { row: number; column: number }) => {
    return arr2d[row]?.[column];
  };

  const offset = direction === "right" ? 1 : -1;
  // move left or right 1 column depend on direction
  if (
    isValidCell(
      targetCell({
        row: currentSelectedCell.row,
        column: currentSelectedCell.column + offset,
      })
    )
  ) {
    return {
      cell: {
        row: currentSelectedCell.row,
        column: currentSelectedCell.column + offset,
      },
    };
  }

  // we handle 3 cases on condition if selected cell is on the fsrt column
  // 1. on the first emoji of our grid
  // 2. on the first clumn of row then we want to move to the 1 previous row at the last column
  // 3. on the first clumn of row then we want to move to the 2 previous row at the last column that have emoji
  if (direction === "left" && currentSelectedCell.column === 0) {
    // If we're on the first row's cell (our first row is on index1, index0 is for heading)
    if (currentSelectedCell.row === 1 && currentSelectedCell.column === 0) {
      // scroll up 1 row if the heading of first row is not visible
      const isScrollingUp = checkIfScrollingUp({
        gridRef,
        targetRow: currentSelectedCell.row - 1,
        CELL_HEIGHT,
        outerRef,
      });

      if (isScrollingUp) {
        targetRowsToScroll = getNumberOfRowsToScrollUp({
          gridRef,
          targetRow: currentSelectedCell.row - 1,
          CELL_HEIGHT,
          outerRef,
        });
      }

      return {
        cell: {
          row: currentSelectedCell.row,
          column: currentSelectedCell.column,
        },
        targetRowsToScroll,
      };
    }

    // if we on the first column, move to the last column of the previous row but make sure there's an emoji on that cell
    if (
      isValidCell(
        targetCell({
          row: currentSelectedCell.row - 1,
          column: 0,
        })
      )
    ) {
      const isScrollingUp = checkIfScrollingUp({
        gridRef,
        targetRow: currentSelectedCell.row - 1,
        CELL_HEIGHT,
        outerRef,
      });

      if (isScrollingUp) {
        targetRowsToScroll = getNumberOfRowsToScrollUp({
          gridRef,
          targetRow: currentSelectedCell.row - 1,
          CELL_HEIGHT,
          outerRef,
        });
      }

      return {
        cell: { row: currentSelectedCell.row - 1, column: COLUMNS - 1 },
        targetRowsToScroll,
      };
    }

    const isScrollingUp = checkIfScrollingUp({
      gridRef,
      targetRow: currentSelectedCell.row - 2,
      CELL_HEIGHT,
      outerRef,
    });

    if (isScrollingUp) {
      targetRowsToScroll = getNumberOfRowsToScrollUp({
        gridRef,
        targetRow: currentSelectedCell.row - 2,
        CELL_HEIGHT,
        outerRef,
      });
    }

    // if we are here it's mean last column from previouse row not have a emoji because it's refer to heading row
    // If we're on the first column, move to the 2 previous row and get the last column that has an emoji.
    return {
      cell: {
        row: currentSelectedCell.row - 2,
        column: findLastStringIndex(arr2d[currentSelectedCell.row - 2]),
      },
      targetRowsToScroll,
    };
  }

  if (direction === "right") {
    // If we're on the last column, move to the next row
    if (
      currentSelectedCell.column === COLUMNS - 1 &&
      isValidCell(targetCell({ row: currentSelectedCell.row + 1, column: 0 }))
    ) {
      // scroll down 1 row if the target is not visible
      const isScrollingDown = checkIfScrollingDown({
        gridRef,
        targetRow: currentSelectedCell.row + 1,
        CELL_HEIGHT,
        outerRef,
      });

      if (isScrollingDown) {
        targetRowsToScroll = getNumberOfRowsToScrollDown({
          gridRef,
          targetRow: currentSelectedCell.row + 1,
          CELL_HEIGHT,
          outerRef,
        });
      }
      return {
        cell: { row: currentSelectedCell.row + 1, column: 0 },
        targetRowsToScroll,
      };
    }

    if (
      isValidCell(targetCell({ row: currentSelectedCell.row + 2, column: 0 }))
    ) {
      const isScrollingDown = checkIfScrollingDown({
        gridRef,
        targetRow: currentSelectedCell.row + 2,
        CELL_HEIGHT,
        outerRef,
      });
      // scroll down 2 row if the target is not visible
      if (isScrollingDown) {
        targetRowsToScroll = getNumberOfRowsToScrollDown({
          gridRef,
          targetRow: currentSelectedCell.row + 2,
          CELL_HEIGHT,
          outerRef,
        });
      }

      return {
        cell: { row: currentSelectedCell.row + 2, column: 0 },
        targetRowsToScroll,
      };
    }
  }
  // default value
  return {
    cell: {
      row: currentSelectedCell.row,
      column: currentSelectedCell.column,
    },
  };
};

export const getVisibleRowRange = ({
  CELL_HEIGHT,
  gridRef,
  outerRef,
}: {
  CELL_HEIGHT: number;
  gridRef: React.RefObject<Grid<ItemData> | null>;
  outerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (!gridRef.current) return { startRow: 0, endRow: 0 };

  const { scrollTop, clientHeight } = outerRef.current || {
    scrollTop: 0,
    clientHeight: 0,
  };

  const topPixel = scrollTop;
  const visibleTopRowFloat = topPixel / CELL_HEIGHT;
  const visibleTopRowFloor = Math.floor(visibleTopRowFloat);

  const startRow =
    visibleTopRowFloat - visibleTopRowFloor < 0.5
      ? visibleTopRowFloor
      : visibleTopRowFloor + 1;

  const bottomPixel = scrollTop + clientHeight;
  const visibleBottomRowFloat = bottomPixel / CELL_HEIGHT;
  const visibleBottomRowFloor = Math.floor(
    (scrollTop + clientHeight) / CELL_HEIGHT
  );
  const endRow =
    visibleBottomRowFloat - visibleBottomRowFloor < 0.5
      ? visibleBottomRowFloor - 1
      : visibleBottomRowFloor;

  return { startRow, endRow };
};

export function getRandomCellByItemCount(
  itemCount: number,
  items: Emoji[]
): Emoji {
  const index = Math.floor(Math.random() * itemCount); // Random flat index
  const cell = items[index];

  return cell;
}

export function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}
