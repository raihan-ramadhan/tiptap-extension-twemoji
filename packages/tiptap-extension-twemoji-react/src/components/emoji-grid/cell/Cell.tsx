import "./cell.scss";

import { GridChildComponentProps } from "react-window";
import { ItemData } from "@/types";
import { HTMLAttributes, memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  getCellPadding,
  isActionBtn,
  isCustomEmoji,
  isEmoji,
  isGroupTitle,
} from "@/lib/emoji-grid-utils";
import { getAttributes, SKIN_TONE_MAP } from "@/lib/emoji-utils";
import { Emoji } from "@/data/emoji-sprite-map";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import AddCustomEmoji from "@/components/emoji-grid/add-custom-emoji/AddCustomEmoji";

const Cell: React.FC<GridChildComponentProps<ItemData>> = ({
  columnIndex,
  rowIndex,
  style,
  data,
}) => {
  const {
    arr2d,
    selectedCell,
    onSelectEmoji,
    selectedCellElementRef,
    skinTone,
    range,
    cellRefs,
    handleHover,
    onError,
    onSuccess,
    upload,
    disableEmojiCellsNavigation,
    enableEmojiCellsNavigation,
    activateTrap,
    deactivateTrap,
    accept,
    maxSize,
    cellSize,
    interceptAddEmojiClick,
    disabledAddCustomEmoji,
    onCancel,
  } = data;
  const emojiData = arr2d[rowIndex][columnIndex];

  const cellPadding = getCellPadding(cellSize);

  if (!emojiData) return null;

  const isSelected =
    selectedCell.column === columnIndex && selectedCell.row === rowIndex;

  type ButtonAttrs = HTMLAttributes<HTMLButtonElement> & {
    "data-selected-cell": boolean;
    ref: (node: HTMLButtonElement) => void;
  };

  const buttonAttrs: ButtonAttrs = {
    style: { ...style, height: cellSize, width: cellSize },
    className: cn(
      "twemoji-button twemoji-cell",
      isSelected && "twemoji-cell--selected"
    ),
    onMouseMoveCapture: () => {
      handleHover(rowIndex, columnIndex);
    },
    ["data-selected-cell"]: isSelected,
    ref: (node: HTMLButtonElement) => {
      if (isSelected) {
        selectedCellElementRef.current = node;
      }
      cellRefs.current.set(`${rowIndex}-${columnIndex}`, node);
    },
    tabIndex: isSelected ? undefined : -1,
  };

  function renderEmojiCell(
    content: React.ReactNode,
    label: string,
    onClick: () => void
  ) {
    return (
      <Tooltip>
        <TooltipTrigger onClick={onClick} {...buttonAttrs}>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <span>{label}</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (isEmoji(emojiData)) {
    const { label, skins } = emojiData;

    let newEmoji = emojiData;
    const tone: string = SKIN_TONE_MAP[skinTone].tone;

    if (skinTone && skinTone !== "default" && skins && skins[tone]) {
      newEmoji = skins[tone] as Emoji;
    }

    const finalEmoji = useMemo(() => {
      if (skinTone && skinTone !== "default" && skins?.[tone]) {
        return skins[tone] as Emoji;
      }
      return emojiData;
    }, [emojiData, skinTone]);

    const htmlAttr = useMemo(() => {
      return getAttributes({
        data: finalEmoji,
        styleOption: { type: "object", sizeInpixel: cellSize - cellPadding },
      });
    }, [finalEmoji, cellSize]);

    let content = (
      <img
        loading="lazy"
        {...htmlAttr}
        style={
          typeof htmlAttr.style === "string"
            ? undefined
            : { ...htmlAttr.style, cursor: "pointer" } // only for typescript, to avoid error
        }
      />
    );

    return renderEmojiCell(content, label, () => {
      onSelectEmoji({
        emoji: newEmoji,
        baseHexcode: emojiData.hexcode,
        range,
      });
    });
  }

  if (isCustomEmoji(emojiData)) {
    const { url, label } = emojiData;

    const content = (
      <img
        loading="lazy"
        alt={label}
        src={url}
        draggable={false}
        style={{
          width: cellSize - cellPadding,
          height: cellSize - cellPadding,
          display: "inline-block",
          margin: "0 0.1em",
          verticalAlign: "-0.1em",
          objectFit: "contain",
          cursor: "pointer",
        }}
      />
    );

    return renderEmojiCell(content, label, () => {
      onSelectEmoji({
        emoji: emojiData,
        range,
      });
    });
  }

  if (isActionBtn(emojiData)) {
    const { buttonLabel, align } = emojiData;

    const content = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={(cellSize - cellPadding) / 2}
        height={(cellSize - cellPadding) / 2}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="twemoji-svg-cell"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    );

    return (
      <AddCustomEmoji
        onCancel={onCancel}
        maxSize={maxSize}
        accept={accept}
        onSubPopoverMount={() => {
          deactivateTrap();
          disableEmojiCellsNavigation();
        }}
        onSubPopoverUnmount={() => {
          activateTrap();
          enableEmojiCellsNavigation();
        }}
        onErrorUpload={onError}
        onSuccess={onSuccess}
        label={buttonLabel}
        upload={upload}
        align={align}
        side="top"
        {...buttonAttrs}
        style={{
          ...style,
          height: cellSize - cellPadding,
          width: cellSize - cellPadding,
          marginTop: cellPadding / 2,
          marginLeft: cellPadding / 2,
          padding: 0,
        }}
        className={cn(
          "twemoji-button twemoji-custom-emoji-cell",
          isSelected && "twemoji-custom-emoji-cell--selected"
        )}
        interceptAddEmojiClick={interceptAddEmojiClick}
        disabledAddCustomEmoji={disabledAddCustomEmoji}
      >
        {content}
      </AddCustomEmoji>
    );
  }

  if (isGroupTitle(emojiData)) {
    return (
      <div style={style} className="twemoji-group-title-cell ">
        {emojiData.groupTitle}
      </div>
    );
  }

  return null;
};
export default memo(Cell);
