import { Children, cloneElement, useCallback, useRef, useState } from "react";

// Utilities
import { getRandomCellByItemCount } from "@/lib/emoji-grid-utils";

// Components
import EmojiGrid from "@/components/emoji-grid/EmojiGrid";
import { Popover } from "./Popover";

// TYPES
import { Emoji } from "@/data/emoji-sprite-map";
import { CustomEmoji, ExtensionOptions } from "@/types";

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
  defaultOpen = false,
  isOpen: controlledOpen,
  onOpenChange,
  onDelete,
  closeAfterDelete,
  customEmojis,
  upload,
  onError,
  onSuccess,
}: ExtensionOptions & {
  children: React.ReactElement<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;
  setRandomEmojiOnEmpty?: boolean;
  selectEmojiHandler: (emoji: CustomEmoji | Emoji) => void;
  isEmpty?: boolean;
  headerInput?: boolean;
  randomButton?: boolean;
  removeButton?: boolean;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDelete?: () => void;
  closeAfterDelete?: boolean;
  customEmojis?: CustomEmoji[];
}) {
  const child = Children.only(children);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setIsOpen = (open: boolean) => {
    if (!isControlled) setUncontrolledOpen(open);
    onOpenChange?.(open);
  };

  const { query, setQuery, items, filteredEmojis } = useEmojiGridState({
    customEmojis,
  });

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      child.props.onClick?.(e);

      if (setRandomEmojiOnEmpty && isEmpty && filteredEmojis.length > 0) {
        const randomEmoji = getRandomCellByItemCount(
          filteredEmojis.length,
          filteredEmojis
        );
        selectEmojiHandler(randomEmoji);
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
    ref: triggerRef,
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
        onDelete={onDelete}
        closeAfterDelete={closeAfterDelete}
        upload={upload}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Popover>
  );
}
