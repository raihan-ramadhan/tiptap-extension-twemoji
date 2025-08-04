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
      <li
        style={{ width: navItemWidth, height: navItemWidth }}
        className="overflow-hidden"
      >
        <TooltipTrigger
          tabIndex={isGroupExist ? 0 : -1}
          ref={ref}
          onClick={handleClick}
          onKeyDown={stopEnterKey}
          className={cn(
            `justify-items-center content-center size-full twemoji-button`,
            !isGroupExist && "cursor-auto opacity-25",
            isGroupExist && "hover:bg-(--twemoji-secondary-color)",
            isActive && "bg-(--twemoji-secondary-color)"
          )}
        >
          {
            <item.icon className="stroke-(length:--twemoji-icon-stroke-width) size-full" />
          }
        </TooltipTrigger>
      </li>
      <TooltipContent>
        <span>{item.title}</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default memo(NavItem);
