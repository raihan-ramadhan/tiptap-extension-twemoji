"use client";

import { EmojiPopoverTriggerWrapper } from "@raihancodes/tiptap-extension-twemoji-react/popover";
import {
  CustomEmoji,
  Emoji,
  isEmoji,
} from "@raihancodes/tiptap-extension-twemoji-react";
import React, { useState } from "react";
import Image from "next/image";

const IconFileButton = () => {
  const [iconAttrs, setIconAttrs] = useState<
    | {
        [x: string]: string | boolean | React.CSSProperties;
        src: string;
        alt: string;
        draggable: boolean;
        style: string | React.CSSProperties;
      }
    | {
        alt: string;
        src: string;
        draggable: boolean;
        style: Record<string, string | number>;
      }
    | null
  >(null);

  const selectEmojiHandler = (emoji: CustomEmoji | Emoji) => {
    let attrs;

    if (isEmoji(emoji)) {
      attrs = {
        alt: emoji.label,
        src: emoji.svgUrl,
        draggable: false,
        style: {
          display: "inline-block",
          margin: "0 0.1em",
          verticalAlign: "-0.1em",
          objectFit: "contain",
        },
      };
    } else {
      attrs = {
        alt: emoji.label,
        src: emoji.url,
        draggable: false,
        style: {
          display: "inline-block",
          margin: "0 0.1em",
          verticalAlign: "-0.1em",
          objectFit: "contain",
        },
      };
    }

    if (attrs) {
      setIconAttrs(attrs);
    }
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onDelete = () => {
    setIconAttrs(null);
  };

  return (
    <EmojiPopoverTriggerWrapper
      isEmpty={!iconAttrs}
      setRandomEmojiOnEmpty
      selectEmojiHandler={selectEmojiHandler}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onDelete={onDelete}
    >
      <button
        type="button"
        className="dark:bg-white/5 bg-black/5 p-1 rounded-md dark:hover:bg-white/10 hover:bg-black/10 transition-colors cursor-pointer "
      >
        {iconAttrs ? (
          <Image
            alt={iconAttrs.alt}
            src={iconAttrs.src}
            width={78}
            height={78}
            draggable={iconAttrs.draggable}
            style={
              typeof iconAttrs.style === "string" ? undefined : iconAttrs.style
            }
            className="aspect-square"
          />
        ) : (
          "Add Emoji"
        )}
      </button>
    </EmojiPopoverTriggerWrapper>
  );
};

export default IconFileButton;
