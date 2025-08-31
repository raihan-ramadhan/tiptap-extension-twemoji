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
import { Smile } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { Button } from "./ui/button";

type IconAttrs = {
  alt: string;
  src: string;
  draggable: boolean;
  style: React.CSSProperties;
};

const IconFileButton = ({
  setIsOpen: setIsOpenDialog,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [iconAttrs, setIconAttrs] = useState<IconAttrs | null>(null);

  const selectEmojiHandler = (emoji: CustomEmoji | Emoji) => {
    const src = isEmoji(emoji) ? emoji.svgUrl : emoji.url;

    const attrs = {
      alt: emoji.label,
      src,
      draggable: false,
      style: {
        display: "inline-block",
        margin: "0 0.1em",
        verticalAlign: "-0.1em",
        objectFit: "contain",
      } as React.CSSProperties,
    };

    setIconAttrs(attrs);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onDelete = () => {
    setIconAttrs(null);
  };

  const customEmojis = getLatestCustomEmojis();

  const router = useRouter();

  const isMobile = useIsMobile();

  return (
    <EmojiPopoverTriggerWrapper
      gridOptions={{
        cellSize: isMobile ? 24 : undefined,
      }}
      headerOptions={{
        isEmpty: !iconAttrs,
        onDelete,
      }}
      customEmojiOptions={{
        upload: (props) => handleEmojiUpload(props),
        onSuccess: (successMessage, callback) =>
          handleEmojiOnSuccess(successMessage, callback, router),
        onError: (errorMessage) => handleEmojiOnError(errorMessage),
        interceptAddEmojiClick: (dismiss) =>
          handleInterceptAddCustomEmoji(() => {
            dismiss?.();
            setIsOpenDialog(true);
          }),
      }}
      selectEmojiHandler={selectEmojiHandler}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      customEmojis={customEmojis}
    >
      <Button
        variant={"secondary"}
        className={iconAttrs ? "p-1 size-fit" : undefined}
      >
        {iconAttrs ? (
          <Image
            alt={iconAttrs.alt}
            src={iconAttrs.src}
            width={78}
            height={78}
            draggable={iconAttrs.draggable}
            style={iconAttrs.style}
          />
        ) : (
          <>
            <Smile className="size-5" />
            Add Emoji
          </>
        )}
      </Button>
    </EmojiPopoverTriggerWrapper>
  );
};

export default IconFileButton;
