import "./nav.scss";

import { FixedSizeGrid as Grid } from "react-window";
import { EMOJI_GROUPS_PROPS } from "@/lib/emoji-groups";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ARRAY2D_ITEM_PROPS, DropzoneUploadProps, ItemData } from "@/types";
import AddCustomEmoji from "@/components/emoji-grid/add-custom-emoji/AddCustomEmoji";
import { debounce } from "lodash-es";
import { Plus } from "lucide-react";
import NavItem from "./NavItem";
import { navIcons } from "./nav-icon";
import { cn } from "@/lib/utils";
import { getCellPadding } from "../../../lib/emoji-grid-utils";

interface NavProps {
  groupsIndexes: Record<EMOJI_GROUPS_PROPS, number | undefined>;
  gridRef: React.ForwardedRef<Grid<ItemData>>;
  outerRef: React.RefObject<HTMLDivElement | null>;
  width: number;
  arr2d: ARRAY2D_ITEM_PROPS[];
  disableEmojiCellsNavigation: () => void;
  enableEmojiCellsNavigation: () => void;
  className?: string;
  onCancel?: () => void;
  cellSize: number;
}

const Nav = ({
  gridRef,
  groupsIndexes,
  outerRef,
  width,
  arr2d,
  onError,
  onSuccess,
  upload,
  disableEmojiCellsNavigation,
  enableEmojiCellsNavigation,
  className,
  accept,
  maxSize,
  interceptAddEmojiClick,
  disabledAddCustomEmoji,
  onCancel,
  cellSize,
}: NavProps & DropzoneUploadProps) => {
  const cellPadding = getCellPadding(cellSize);

  const initialActiveNav = useMemo(() => {
    return Object.keys(groupsIndexes).find(
      (key) => groupsIndexes[key as EMOJI_GROUPS_PROPS] === 0
    ) as EMOJI_GROUPS_PROPS | undefined;
  }, [groupsIndexes]);

  const [activeNav, setActiveNav] = useState<EMOJI_GROUPS_PROPS | undefined>(
    initialActiveNav
  );

  function scrollToGroup(rowIndex: number) {
    if (!(gridRef && "current" in gridRef && gridRef.current)) return;

    gridRef.current?.scrollToItem({
      align: "start",
      rowIndex,
      columnIndex: 0,
    });
  }

  const stopEnterKey = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter") event.stopPropagation();
    },
    []
  );

  useEffect(() => {
    if (!outerRef?.current) return;

    const trackScroll = debounce(() => {
      const currentScrollTop = outerRef.current?.scrollTop || 0;
      const keys = Object.keys(groupsIndexes).reverse();

      for (let i = 0; i < keys.length; i++) {
        const groupKey = keys[i] as EMOJI_GROUPS_PROPS;
        if (typeof groupsIndexes[groupKey] === "number") {
          const groupOffset = groupsIndexes[groupKey] * cellSize;

          if (currentScrollTop >= groupOffset) {
            setActiveNav(groupKey);
            break;
          }
        }
      }
    }, 50); // Adjust delay as needed

    const outer = outerRef.current;
    outer.addEventListener("scroll", trackScroll);

    return () => {
      outer.removeEventListener("scroll", trackScroll);
      trackScroll.cancel();
    };
  }, [outerRef, groupsIndexes, cellSize]);

  useEffect(() => {
    setActiveNav(initialActiveNav);
  }, [arr2d]);

  return (
    <div
      style={{ width: `${width}px` }}
      className={cn("twemoji-nav", className)}
    >
      <ul className="twemoji-nav__list">
        {navIcons.map((item, index) => {
          const isGroupExist = typeof groupsIndexes[item.title] !== "undefined";
          const isActive = activeNav === item.title;

          const handleClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            event.preventDefault();

            if (isGroupExist) {
              setActiveNav(item.title);
              if (typeof groupsIndexes[item.title] !== "undefined") {
                scrollToGroup(groupsIndexes[item.title]!);
              }
            }
          };

          return (
            <NavItem
              cellSize={cellSize}
              key={index}
              item={item}
              isActive={isActive}
              handleClick={handleClick}
              stopEnterKey={stopEnterKey}
              isGroupExist={isGroupExist}
            />
          );
        })}
        <li
          style={{
            width: cellSize,
            height: cellSize,
          }}
        >
          <AddCustomEmoji
            onCancel={onCancel}
            maxSize={maxSize}
            accept={accept}
            side="top"
            align="end"
            onSubPopoverMount={disableEmojiCellsNavigation}
            onSubPopoverUnmount={enableEmojiCellsNavigation}
            onErrorUpload={onError}
            onSuccess={onSuccess}
            upload={upload}
            onKeyDown={stopEnterKey}
            interceptAddEmojiClick={interceptAddEmojiClick}
            disabledAddCustomEmoji={disabledAddCustomEmoji}
            className={cn(
              "twemoji-button twemoji-nav__add-custom-emoji",
              disabledAddCustomEmoji && "twemoji-nav__item--disabled"
            )}
            style={{
              padding: cellPadding / 2 + 2,
            }}
          >
            <Plus className="twemoji-nav__add-custom-emoji__icon" />
          </AddCustomEmoji>
        </li>
      </ul>
    </div>
  );
};

export default memo(Nav);
