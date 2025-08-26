import { Children, cloneElement, useCallback, useRef, useState } from "react";

// Utilities
import { getRandomCellByItemCount } from "@/lib/emoji-grid-utils";

// Components
import EmojiGrid from "@/components/emoji-grid/grid/Grid";
import { Popover } from "./Popover";

// TYPES
import { Emoji } from "@/data/emoji-sprite-map";
import {
  CustomEmoji,
  HeaderUisProps,
  ExtensionHeaderOptions,
  ExtensionCustomEmojiOptions,
  ExtensionNavOptions,
  ExtensionGridOptions,
} from "@/types";

// Hooks
import { useEmojiGridState } from "@/hooks/useEmojiGridState";
import {
  DEFAULT_ACCEPT,
  DEFAULT_CELL_SIZE,
  DEFAULT_MAX_SIZE,
  DEFAULT_MIN_CELLS_TO_HIDE_NAV,
  DEFAULT_ON_ERROR,
  DEFAULT_ON_SUCCESS,
  DEFAULT_UPLOAD,
  DEFAULT_VISIBLE_ROWS,
  LOCAL_STORAGE_RECENT_EMOJIS_KEY,
} from "@/constants";

type EmojiPopoverTriggerWrapperProps = {
  selectEmojiHandler: (emoji: CustomEmoji | Emoji) => void;
  children: React.ReactElement<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  customEmojis?: CustomEmoji[];
  /**
   * @default false
   */
  defaultOpen?: boolean;
  headerOptions?: {
    /**
     * state for setRandomEmojiOnEmpty
     */
    isEmpty?: boolean;
    /**
     * If `true`, automatically calls the `selectEmojiHandler` prop with a random emoji
     * when `isEmpty` is `true`.
     * @default true
     */
    setRandomEmojiOnEmpty?: boolean;
    /**
     * callback to run when <RemoveButton/> clicked
     */
    onDelete?: () => void;
    /**
     *  dismiss popover after delete
     * @default true
     */
    closeAfterSelectRandom?: boolean;
    /**
     *  dismiss popover after delete
     * @default true
     */
    closeAfterDelete?: boolean;
    /**
     * Show <RemoveButton />
     * @default true
     */
    removeButton?: HeaderUisProps["removeButton"];
  } & ExtensionHeaderOptions;
  customEmojiOptions?: ExtensionCustomEmojiOptions;
  navOptions?: ExtensionNavOptions;
  gridOptions?: ExtensionGridOptions;
};

export function EmojiPopoverTriggerWrapper({
  children,
  selectEmojiHandler,
  defaultOpen = false,
  isOpen: controlledOpen,
  onOpenChange,
  customEmojis,
  headerOptions,
  customEmojiOptions,
  navOptions,
  gridOptions,
}: EmojiPopoverTriggerWrapperProps) {
  const {
    isEmpty,
    onDelete,
    randomButton = true,
    removeButton = true,
    skinToneSelect = true,
    closeAfterDelete = true,
    setRandomEmojiOnEmpty = true,
    closeAfterSelectRandom = true,
  } = headerOptions ?? {};

  const { minCellsToHideNav = DEFAULT_MIN_CELLS_TO_HIDE_NAV } =
    navOptions ?? {};

  const {
    upload = DEFAULT_UPLOAD,
    onError = DEFAULT_ON_ERROR,
    onSuccess = DEFAULT_ON_SUCCESS,
    accept = DEFAULT_ACCEPT,
    maxSize = DEFAULT_MAX_SIZE,
    interceptAddCustomEmojiClick = false,
    disabledAddCustomEmoji = false,
  } = customEmojiOptions ?? {};

  const {
    cellSize = DEFAULT_CELL_SIZE,
    visibleRows = DEFAULT_VISIBLE_ROWS,
    localStorageRecentEmojisKey = LOCAL_STORAGE_RECENT_EMOJIS_KEY,
  } = gridOptions ?? {};

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
    localStorageRecentEmojisKey,
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
      trigger={trigger}
    >
      <EmojiGrid
        cellSize={cellSize}
        visibleRows={visibleRows}
        minCellsToHideNav={minCellsToHideNav}
        maxSize={maxSize}
        accept={accept}
        focusImmediately
        headerInput={true}
        randomButton={randomButton}
        removeButton={removeButton}
        query={query}
        setQuery={setQuery}
        onSelectEmoji={({ emoji }) => {
          selectEmojiHandler(emoji);
          if (closeAfterSelectRandom) {
            setIsOpen(false);
            requestAnimationFrame(() => {
              triggerRef.current?.focus();
            });
          }
        }}
        onCancel={() => setIsOpen(false)}
        items={items}
        onDelete={() => {
          onDelete?.();
          if (closeAfterDelete) {
            requestAnimationFrame(() => {
              triggerRef.current?.focus();
            });
          }
        }}
        closeAfterDelete={closeAfterDelete}
        upload={upload}
        onSuccess={onSuccess}
        onError={onError}
        skinToneSelect={skinToneSelect}
        interceptAddCustomEmojiClick={interceptAddCustomEmojiClick}
        disabledAddCustomEmoji={disabledAddCustomEmoji}
        triggerRef={triggerRef}
      />
    </Popover>
  );
}
