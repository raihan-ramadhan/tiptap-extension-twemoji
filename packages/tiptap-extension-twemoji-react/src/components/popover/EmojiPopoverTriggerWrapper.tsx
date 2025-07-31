import { Children, cloneElement, useCallback, useState } from "react";

// Utilities
import { getRandomCellByItemCount } from "@/lib/emoji-grid-utils";

// Components
import EmojiGrid from "@/components/emoji-grid/EmojiGrid";
import { Popover } from "./Popover";

// TYPES
import { Emoji } from "@/data/emoji-sprite-map";
import { CustomEmoji } from "@/types";

// Hooks
import { useEmojiGridState } from "@/hooks/useEmojiGridState";

export function EmojiPopoverTriggerWrapper({
  setRandomEmojiOnEmpty = false,
  isEmpty,
  children,
  selectEmojiHandler,
  headerInput = true,
  randomButton = true,
  removeButton = true,
}: {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  setRandomEmojiOnEmpty?: boolean;
  selectEmojiHandler: (emoji: CustomEmoji | Emoji | null) => void;
  isEmpty?: boolean;
  headerInput?: boolean;
  randomButton?: boolean;
  removeButton?: boolean;
}) {
  const child = Children.only(children);

  const { query, setQuery, items, filteredEmojis } = useEmojiGridState();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (child.props.onClick) {
        child.props.onClick(e);
      }
      if (setRandomEmojiOnEmpty && isEmpty) {
        selectEmojiHandler(
          getRandomCellByItemCount(filteredEmojis.length, filteredEmojis)
        );
      }
    },
    [
      child.props.onClick,
      setRandomEmojiOnEmpty,
      isEmpty,
      filteredEmojis,
      selectEmojiHandler,
    ]
  );

  const trigger = cloneElement(child, {
    ...child.props,
    onClick: handleClick,
  });

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      align="center"
      fallback={[]}
      trigger={trigger}
    >
      <EmojiGrid
        focusImmediately
        headerInput={headerInput}
        randomButton={randomButton}
        removeButton={removeButton}
        query={query}
        setQuery={setQuery}
        callback={selectEmojiHandler}
        onSelectEmoji={({ emoji }) => {
          selectEmojiHandler(emoji);
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
        items={items}
      />
    </Popover>
  );
}
