"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeDropdownMenuRadioGroup } from "./theme-dropdown-menu-radio-group";

export function ThemeDropdown() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { theme, systemTheme } = useTheme();

  const displayIconTheme = theme === "system" ? systemTheme : theme;

  if (!mounted) {
    return (
      <Button
        variant={"secondary"}
        size={"sm"}
        className="flex-1 animate-pulse bg-secondary-foreground/5"
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size={"sm"} className="flex-1">
          {displayIconTheme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : displayIconTheme === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : null}
          <span>
            {theme?.charAt(0)?.toUpperCase()}
            {theme?.slice(1)}
          </span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
      >
        <ThemeDropdownMenuRadioGroup />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
