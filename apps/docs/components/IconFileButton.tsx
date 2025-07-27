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

  const selectEmojiHandler = (emoji: CustomEmoji | Emoji | null) => {
    let attrs;

    if (emoji === null) return setIconAttrs(null);

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

  return (
    <EmojiPopoverTriggerWrapper
      isEmpty={!iconAttrs}
      setRandomEmojiOnEmpty
      selectEmojiHandler={selectEmojiHandler}
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
          className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
        />
      ) : (
        <button
          type="button"
          className="bg-white/10 p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
        >
          Add Emoji
        </button>
      )}
    </EmojiPopoverTriggerWrapper>
  );
};

export default IconFileButton;
