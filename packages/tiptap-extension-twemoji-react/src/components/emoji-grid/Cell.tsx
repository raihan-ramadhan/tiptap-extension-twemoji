import { GridChildComponentProps } from "react-window";
import { ItemData } from "@/types";
import { HTMLAttributes, memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CELL_HEIGHT } from "@/constants";
import {
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
  } = data;
  const emojiData = arr2d[rowIndex][columnIndex];

  if (!emojiData) return null;

  const isSelected =
    selectedCell.column === columnIndex && selectedCell.row === rowIndex;

  type ButtonAttrs = HTMLAttributes<HTMLButtonElement> & {
    "data-selected-cell": boolean;
    ref: (node: HTMLButtonElement) => void;
  };

  const buttonAttrs: ButtonAttrs = {
    style: style,
    className: cn(
      "flex justify-center items-center twemoji-button !p-1",
      `size-[${CELL_HEIGHT}px]`,
      isSelected && "bg-(--twemoji-secondary-color)"
    ),
    onMouseMoveCapture: () => {
      handleHover(rowIndex, columnIndex);
    },
    ["data-selected-cell"]: true,
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
        styleOption: { type: "object", sizeInpixel: 24 },
      });
    }, [finalEmoji]);

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
          width: 24,
          height: 24,
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
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-(--twemoji-border-color)"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    );

    return (
      <AddCustomEmoji
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
        fallback={["bottom"]}
        onSuccess={onSuccess}
        label={buttonLabel}
        upload={upload}
        align={align}
        side="top"
        {...buttonAttrs}
        className={cn(
          "relative translate-x-[2px] translate-y-[2px] !size-7 flex items-center !rounded-full justify-center twemoji-button ring-inset ring-[1px] ring-(--twemoji-border-color)",
          isSelected && "bg-(--twemoji-secondary-color)"
        )}
      >
        {content}
      </AddCustomEmoji>
    );
  }

  if (isGroupTitle(emojiData)) {
    return (
      <div
        style={style}
        className="text-nowrap text-xs font-medium inline-flex items-center "
      >
        {emojiData.groupTitle}
      </div>
    );
  }

  return null;
};
export default memo(Cell);
