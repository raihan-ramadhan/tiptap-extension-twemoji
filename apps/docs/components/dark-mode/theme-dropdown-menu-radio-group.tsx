"use client";

import * as React from "react";

import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeDropdownMenuRadioGroup() {
  const { setTheme, theme, systemTheme } = useTheme();

  const displayIconTheme = theme === "system" ? systemTheme : theme;

  return (
    <>
      <DropdownMenuLabel className="inline-flex gap-2 items-center">
        {displayIconTheme === "dark" ? (
          <Moon className="h-[0.8rem] w-[0.8rem]" />
        ) : displayIconTheme === "light" ? (
          <Sun className="h-[0.8rem] w-[0.8rem]" />
        ) : null}
        Theme
      </DropdownMenuLabel>
      <DropdownMenuSeparator className="mx-1" />
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  );
}
