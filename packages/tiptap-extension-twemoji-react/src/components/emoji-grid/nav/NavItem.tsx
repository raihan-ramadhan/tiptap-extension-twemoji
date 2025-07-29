import { memo, useRef } from "react";
import { navIcons } from "./nav-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { cn } from "../../../lib/utils";

const NavItem = ({
  item,
  navItemWidth,
  isGroupExist,
  isActive,
  handleClick,
  stopEnterKey,
}: {
  handleClick: (event: React.MouseEvent) => void;
  item: (typeof navIcons)[number];
  navItemWidth: number;
  isGroupExist: boolean;
  isActive: boolean;
  stopEnterKey: (event: React.KeyboardEvent<HTMLElement>) => void;
}) => {
  const ref = useRef<HTMLLIElement | null>(null);
  return (
    <Tooltip delay={200}>
      <li>
        <TooltipTrigger
          ref={ref}
          onClick={handleClick}
          onKeyDown={stopEnterKey}
          style={{ width: `${navItemWidth}px` }}
          className={cn(
            `aspect-square justify-items-center content-center rounded cursor-pointer p-1.5`,
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

export default memo(NavItem);
