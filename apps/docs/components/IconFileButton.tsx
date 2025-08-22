"use client";

import { EmojiPopoverTriggerWrapper } from "@raihancodes/tiptap-extension-twemoji-react/popover";
import {
  CustomEmoji,
  Emoji,
  isEmoji,
} from "@raihancodes/tiptap-extension-twemoji-react";

import React, { useState } from "react";
import Image from "next/image";
import { getLatestCustomEmojis } from "@/store/custom-emojis-store";
import { useRouter } from "next/navigation";
import {
  handleEmojiOnError,
  handleEmojiOnSuccess,
  handleEmojiUpload,
  handleInterceptAddCustomEmoji,
} from "@/lib/handleEmoji";
import { cn } from "@/lib/utils";
import { Smile } from "lucide-react";

const IconFileButton = ({
  setIsOpen: setIsOpenDialog,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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

  const customEmojis = getLatestCustomEmojis();

  const router = useRouter();

  return (
    <EmojiPopoverTriggerWrapper
      headerOptions={{
        isEmpty: !iconAttrs,
        onDelete,
      }}
      customEmojiOptions={{
        upload: (props) => handleEmojiUpload(props),
        onSuccess: (successMessage, callback) =>
          handleEmojiOnSuccess(successMessage, callback, router),
        onError: (errorMessage) => handleEmojiOnError(errorMessage),
        interceptAddCustomEmojiClick: (dismiss) =>
          handleInterceptAddCustomEmoji(() => {
            dismiss?.();
            setIsOpenDialog(true);
          }),
      }}
      selectEmojiHandler={selectEmojiHandler}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      customEmojis={customEmojis}
    >
      <button
        type="button"
        className={cn(
          "dark:bg-white/5 bg-black/5 rounded-md dark:hover:bg-white/10 hover:bg-black/10 transition-colors cursor-pointer w-fit flex gap-1 items-center",
          iconAttrs ? "p-1" : "py-1 px-2"
        )}
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
          <>
            <Smile className="size-5" />
            Add Emoji
          </>
        )}
      </button>
    </EmojiPopoverTriggerWrapper>
  );
};

export default IconFileButton;
