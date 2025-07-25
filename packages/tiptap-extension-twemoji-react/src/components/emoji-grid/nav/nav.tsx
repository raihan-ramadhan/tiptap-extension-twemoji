import { cn } from "@/lib/utils";
import { AddEmojiIcon, navIcons } from "./nav-icons";
import { FixedSizeGrid as Grid } from "react-window";
import { EMOJI_GROUPS_PROPS } from "@/lib/emoji-groups";
import { useEffect, useRef, useState } from "react";
import { ARRAY2D_ITEM_PROPS, ExtensionOptions, ItemData } from "@/types";
import AddEmojiBtnWrapper from "@/components/emoji-grid/add-custom-emoji/AddEmojiBtnWrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";

interface NavProps {
  navItemWidth: number;
  groupsIndexes: Record<EMOJI_GROUPS_PROPS, number | undefined>;
  gridRef: React.ForwardedRef<Grid<ItemData>>;
  outerRef: React.RefObject<HTMLDivElement | null>;
  width: number;
  arr2d: ARRAY2D_ITEM_PROPS[];
  setKeyboardEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Nav = ({
  navItemWidth,
  gridRef,
  groupsIndexes,
  outerRef,
  width,
  arr2d,
  setKeyboardEnabled,
  onError,
  onSuccess,
  upload,
}: NavProps & ExtensionOptions) => {
  const initialActiveNav = Object.keys(groupsIndexes).find(
    (key) => groupsIndexes[key as EMOJI_GROUPS_PROPS] === 0
  ) as EMOJI_GROUPS_PROPS | undefined;

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

  useEffect(() => {
    if (!outerRef || !outerRef.current) {
      return;
    }

    const trackScroll = () => {
      const currentScrollTop = outerRef.current?.scrollTop || 0;
      const keys = Object.keys(groupsIndexes).reverse();

      for (let i = 0; i < keys.length; i++) {
        const groupKey = keys[i] as EMOJI_GROUPS_PROPS;
        if (typeof groupsIndexes[groupKey] === "number") {
          const groupOffset = groupsIndexes[groupKey] * navItemWidth;

          if (currentScrollTop >= groupOffset) {
            setActiveNav(groupKey);
            break;
          }
        }
      }
    };

    outerRef.current?.addEventListener("scroll", trackScroll);
    return () => outerRef.current?.removeEventListener("scroll", trackScroll);
  }, [gridRef, groupsIndexes]);

  useEffect(() => {
    setActiveNav(initialActiveNav);
  }, [arr2d]);

  return (
    <div
      style={{ width: `${width}px` }}
      className={
        "sticky bottom-0 bg-white dark:bg-black h-fit border-neutral-200 dark:border-neutral-800 border-t text-black dark:text-white"
      }
    >
      <ul className="w-full p-1 pr-2 grid grid-cols-12">
        {navIcons.map((item, index) => {
          const isGroupExist = typeof groupsIndexes[item.title] !== "undefined";
          const isActive = activeNav === item.title;

          const handleClick = () => {
            if (isGroupExist) {
              setActiveNav(item.title);
              if (typeof groupsIndexes[item.title] !== "undefined") {
                scrollToGroup(groupsIndexes[item.title]!);
              }
            }
          };

          return (
            <Item
              key={index}
              handleClick={handleClick}
              item={item}
              navItemWidth={navItemWidth}
              isGroupExist={isGroupExist}
              isActive={isActive}
            />
          );
        })}
        <Tooltip delay={200}>
          <li>
            <AddEmojiBtnWrapper
              asChild
              className={cn(
                `w-[${navItemWidth}px] hover:bg-neutral-200 dark:hover:bg-neutral-800 aspect-square justify-items-center content-center rounded cursor-pointer p-1.5`
              )}
              side="top"
              align="end"
              onMount={() => setKeyboardEnabled(false)}
              onUnmount={() => setKeyboardEnabled(true)}
              onErrorUpload={onError}
              onSuccess={onSuccess}
              upload={upload}
            >
              <TooltipTrigger>
                <AddEmojiIcon />
              </TooltipTrigger>
            </AddEmojiBtnWrapper>
          </li>
          <TooltipContent>
            <span>Add emoji</span>
          </TooltipContent>
        </Tooltip>
      </ul>
    </div>
  );
};

const Item = ({
  item,
  navItemWidth,
  isGroupExist,
  isActive,
  handleClick,
}: {
  handleClick: () => void;
  item: (typeof navIcons)[number];
  navItemWidth: number;
  isGroupExist: boolean;
  isActive: boolean;
}) => {
  const ref = useRef<HTMLLIElement | null>(null);
  return (
    <Tooltip delay={200}>
      <li>
        <TooltipTrigger
          ref={ref}
          onClick={handleClick}
          className={cn(
            `w-[${navItemWidth}px] aspect-square justify-items-center content-center rounded cursor-pointer p-1.5`,
            !isGroupExist && "cursor-auto opacity-40",
            isGroupExist && "hover:bg-neutral-200 dark:hover:bg-neutral-800",
            isActive && "bg-neutral-200 dark:bg-neutral-800"
          )}
        >
          {<item.icon />}
        </TooltipTrigger>
      </li>
      <TooltipContent>
        <span>{item.title}</span>
      </TooltipContent>
    </Tooltip>
  );
};
