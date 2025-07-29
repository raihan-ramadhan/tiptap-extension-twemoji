import { cn } from "@/lib/utils";
import { FixedSizeGrid as Grid } from "react-window";
import { EMOJI_GROUPS_PROPS } from "@/lib/emoji-groups";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ARRAY2D_ITEM_PROPS, ExtensionOptions, ItemData } from "@/types";
import AddEmojiBtnWrapper from "@/components/emoji-grid/add-custom-emoji/AddEmojiBtnWrapper";
import { debounce } from "lodash-es";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { Plus } from "lucide-react";
import NavItem from "./NavItem";
import { navIcons } from "./nav-icon";

interface NavProps {
  navItemWidth: number;
  groupsIndexes: Record<EMOJI_GROUPS_PROPS, number | undefined>;
  gridRef: React.ForwardedRef<Grid<ItemData>>;
  outerRef: React.RefObject<HTMLDivElement | null>;
  width: number;
  arr2d: ARRAY2D_ITEM_PROPS[];
  setKeyboardEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const Nav = ({
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
          const groupOffset = groupsIndexes[groupKey] * navItemWidth;

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
  }, [outerRef, groupsIndexes, navItemWidth]);

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
              key={index}
              item={item}
              isActive={isActive}
              handleClick={handleClick}
              navItemWidth={navItemWidth}
              stopEnterKey={stopEnterKey}
              isGroupExist={isGroupExist}
            />
          );
        })}
        <Tooltip delay={200}>
          <li>
            <AddEmojiBtnWrapper
              asChild
              style={{ width: `${navItemWidth}px` }}
              className={cn(
                `hover:bg-neutral-200 dark:hover:bg-neutral-800 aspect-square justify-items-center content-center rounded cursor-pointer p-1.5`
              )}
              side="top"
              align="end"
              onMount={() => setKeyboardEnabled(false)}
              onUnmount={() => setKeyboardEnabled(true)}
              onErrorUpload={onError}
              onSuccess={onSuccess}
              upload={upload}
              onKeyDown={stopEnterKey}
            >
              <TooltipTrigger>
                <Plus className="bg-black rounded-full text-white font-bold stroke-2 size-full" />
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

export default memo(Nav);
