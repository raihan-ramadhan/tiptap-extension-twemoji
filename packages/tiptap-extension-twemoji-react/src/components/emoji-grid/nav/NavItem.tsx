import { memo, useRef } from "react";
import { navIcons } from "./nav-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import { cn } from "@/lib/utils";

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
        style={{
          width: navItemWidth,
          height: navItemWidth,
          overflow: "hidden",
        }}
      >
        <TooltipTrigger
          tabIndex={isGroupExist ? 0 : -1}
          ref={ref}
          onClick={handleClick}
          onKeyDown={stopEnterKey}
          className={cn(
            "twemoji-button twemoji-nav__item",
            !isGroupExist && "twemoji-nav__item--disabled",
            isGroupExist && "twemoji-nav__item--group-exist",
            isActive && "twemoji-nav__item--active"
          )}
        >
          {<item.icon className="twemoji-nav__item__icon" />}
        </TooltipTrigger>
      </li>
      <TooltipContent>
        <span>{item.title}</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default memo(NavItem);
