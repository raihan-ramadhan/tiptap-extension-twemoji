"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  CustomEmoji,
  useEmojiGridState,
  applyEmojiSpriteStyle,
  isEmoji,
} from "@raihancodes/tiptap-extension-twemoji-react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

import { useMemo } from "react";

type Option = {
  type: string;
  value: boolean | number;
};

type BaseOptions = {
  randomButton: Option;
  skinToneSelect: Option;
  interceptAddEmojiClick: Option;
  disabledAddCustomEmoji: Option;
  maxSize: Option;
  minCellsToHideNav: Option;
  visibleRows: Option;
  cellSize: Option;
};

type OptionsWithRemove = BaseOptions & {
  removeButton: Option;
};

type AllOptions = BaseOptions | OptionsWithRemove;

function getInitialValue(
  type: "EmojiPopoverTriggerWrapper" | "editor-suggestion"
): AllOptions {
  const base: BaseOptions = {
    randomButton: { type: "boolean", value: true },
    skinToneSelect: {
      type: "boolean",
      value: true,
    },
    interceptAddEmojiClick: {
      type: "boolean",
      value: false,
    },
    disabledAddCustomEmoji: {
      type: "boolean",
      value: false,
    },
    maxSize: { type: "number", value: 1000 * 1000 * 10 },
    minCellsToHideNav: {
      type: "number",
      value: 60,
    },
    visibleRows: { type: "number", value: 9 },
    cellSize: { type: "number", value: 24 },
  };

  if (type === "EmojiPopoverTriggerWrapper") {
    return {
      removeButton: { type: "boolean", value: true },
      ...base,
    };
  }

  return base;
}

const EmojiGrid = dynamic(
  () =>
    import("@raihancodes/tiptap-extension-twemoji-react").then(
      (mod) => mod.EmojiGrid
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex justify-center items-center bg-muted animate-pulse">
        <span>Loading...</span>
      </div>
    ),
  }
);

const EmojiGridCustomizer = ({
  customEmojis,
  type,
}: {
  customEmojis: CustomEmoji[];
  type: "EmojiPopoverTriggerWrapper" | "editor-suggestion";
}) => {
  const isMobile = useIsMobile();

  const { filteredCustomEmojis, filteredEmojis, query, recent, setQuery } =
    useEmojiGridState({
      customEmojis,
    });

  const initialValue = useMemo(() => getInitialValue(type), [type]);

  const [allOptions, setAllOptions] = useState<AllOptions>(initialValue);

  React.useEffect(() => {
    setAllOptions((prev) => ({
      ...prev,
      cellSize: {
        ...prev.cellSize,
        value: isMobile ? 24 : 32,
      },
    }));
  }, [isMobile]);

  const handleChangeText = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const headerHeight =
    allOptions.randomButton.value ||
    allOptions.skinToneSelect.value ||
    type === "EmojiPopoverTriggerWrapper"
      ? 37
      : 0;
  const navHeight =
    (allOptions.minCellsToHideNav.value as number) <
    recent.length + filteredCustomEmojis.length + filteredEmojis.length
      ? 40
      : 0;
  const gridHeight =
    (allOptions.cellSize.value as number) *
    (allOptions.visibleRows.value as number);

  const widthComponent = (allOptions.cellSize.value as number) * 12 + 18;
  const heightComponent = headerHeight + navHeight + gridHeight;

  useEffect(() => {
    const sheet = applyEmojiSpriteStyle({
      spriteUrl: "/assets/emoji-sprite6102d4c8eb22eb1a.webp",
    });

    return () => {
      if (sheet) {
        document.head.removeChild(sheet);
      }
    };
  }, []);

  return (
    <div className="min-h-96 flex w-full justify-center gap-3 my-5 rounded-xl flex-wrap">
      {/* LEFT */}
      <div className={"flex gap-2 flex-col"}>
        {type === "editor-suggestion" ? (
          <div className="relative w-full h-8">
            <span className="top-1/2 -translate-y-1/2 left-3 absolute z-10">
              {" "}
              :
            </span>
            <Input
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
              value={query}
              onChange={handleChangeText}
              className="w-full resize-none pr-2 pl-4 py-2"
              placeholder="Filter"
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-1.5 z-10 inline-block size-4">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="size-4" />
                </TooltipTrigger>
                <TooltipContent className="w-48 font-medium">
                  This component acts as editor&rsquo;s inline trigger span (
                  the one created when typing{" "}
                  <span className="bg-gray-100 inline-block pl-1.5 pr-0.5 text-black rounded-[2px]">
                    {" "}
                    :
                  </span>{" "}
                  followed by characters ).
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ) : null}

        <motion.div
          className="bg-background rounded-[10px] overflow-hidden border border-border w-full"
          initial={{ width: widthComponent, height: heightComponent }}
          animate={{ width: widthComponent, height: heightComponent }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <EmojiGrid
            randomButton={allOptions.randomButton.value as boolean}
            skinToneSelect={allOptions.skinToneSelect.value as boolean}
            maxSize={allOptions.maxSize.value as number}
            disabledAddCustomEmoji={
              allOptions.disabledAddCustomEmoji.value as boolean
            }
            interceptAddEmojiClick={
              allOptions.interceptAddEmojiClick.value as boolean
            }
            cellSize={allOptions.cellSize.value as number}
            visibleRows={allOptions.visibleRows.value as number}
            minCellsToHideNav={allOptions.minCellsToHideNav.value as number}
            disabledFocusAndEvent={true}
            accept={{ "image/*": [] }}
            headerInput={type === "EmojiPopoverTriggerWrapper"}
            removeButton={
              "removeButton" in allOptions
                ? (allOptions.removeButton.value as boolean)
                : false
            }
            closeAfterDelete={true}
            filteredCustomEmojis={filteredCustomEmojis}
            filteredEmojis={filteredEmojis}
            query={query}
            setQuery={setQuery}
            recent={recent}
            onSelectEmoji={({ emoji }) => {
              console.log(emoji);
              toast(
                `You choose emoji: ${isEmoji(emoji) ? emoji.emoji : emoji.label}`
              );
            }}
            onError={(errorMessage) => toast(errorMessage)}
            onSuccess={(successMessage) => toast(successMessage)}
            upload={async ({ emojiName, handleSuccess, dismiss }) => {
              handleSuccess?.(
                `${emojiName} was added to your workspace (demo only). Try the real upload feature at https://tiptap-extension-twemoji.vercel.app`
              );

              dismiss?.();
            }}
          />
        </motion.div>
      </div>

      {/* RIGHT */}
      <div className="h-fit space-y-3 flex-1">
        <ul className="grid grid-cols-[2fr_1fr] gap-x-5 gap-y-3">
          {Object.entries(allOptions).map(([key, option]) => (
            <React.Fragment key={key}>
              <li className="flex items-center text-sm font-medium">{key}</li>
              {typeof option.value === "boolean" ? (
                <li className="flex items-center justify-end ">
                  <Checkbox
                    checked={option.value}
                    onCheckedChange={() => {
                      setAllOptions((opts) => ({
                        ...opts,
                        [key]: { ...option, value: !option.value },
                      }));
                    }}
                  />
                </li>
              ) : (
                <li className="">
                  <Input
                    type="number"
                    value={option.value}
                    className="w-full"
                    onChange={(e) => {
                      setAllOptions((opts) => ({
                        ...opts,
                        [key]: { ...option, value: Number(e.target.value) },
                      }));
                    }}
                  />
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
        <Button
          className="w-full"
          onClick={() =>
            setAllOptions({
              ...initialValue,
              cellSize: {
                ...initialValue.cellSize,
                value: isMobile ? 24 : 32,
              },
            })
          }
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default EmojiGridCustomizer;
