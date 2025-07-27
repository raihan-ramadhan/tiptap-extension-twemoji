import {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// Store
import { latestCustomEmojis } from "@/store/custom-emojis-store";

// Utilities
import { getRandomCellByItemCount } from "@/lib/emoji-grid-utils";
import { getEmojiSprite } from "@/lib/emoji-utils";

// TYPES
import { CustomEmoji, StoredEmoji, SuggestionItems } from "@/types";

// CONSTANTS
import { LOCAL_STORAGE_RECENT_EMOJIS_KEY } from "@/constants";

// ASSETS & DATA
import emojisSubstringIndexes from "@/assets/emoji-substring-index.json";
import emojiSpriteOrder from "@/data/emoji-sprite-order";
import emojis, { Emoji } from "@/data/emoji-sprite-map";

// Components
import { Alignment, Placement, Side } from "@floating-ui/dom";
import EmojiGrid from "@/components/emoji-grid/EmojiGrid";

// Configs
import {
  sharedAutoUpdatePosition,
  setupDismissListeners,
  customComputePosition,
  floatingStyles,
} from "./config";

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

  const [isOpen, setIsOpen] = useState(false);

  const [query, setQuery] = useState<string>("");
  const lowerQuery = query.toLowerCase().trim();

  const filteredCustomEmojis = useMemo(() => {
    return latestCustomEmojis.filter(({ label }) => label.includes(lowerQuery));
  }, [lowerQuery]);

  const emojisIndexes = emojisSubstringIndexes as Record<string, string[]>;

  const matchedHexcodes =
    lowerQuery.length > 0 ? emojisIndexes[lowerQuery] : emojiSpriteOrder;

  const filteredEmojis = useMemo(() => {
    if (!matchedHexcodes?.length) return [];
    return matchedHexcodes.map((hexcode) => ({
      ...emojis[hexcode],
      hexcode,
    })) as Emoji[];
  }, [matchedHexcodes]);

  const recentEmojis = useMemo(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(LOCAL_STORAGE_RECENT_EMOJIS_KEY);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored) as StoredEmoji[];
      return parsed.map(({ hexcode, ...rest }) =>
        hexcode ? getEmojiSprite({ hexcode }) : (rest as CustomEmoji)
      );
    } catch {
      return null;
    }
  }, []);

  const items: SuggestionItems[] = [
    {
      filteredEmojis,
      filteredCustomEmojis,
      recent: recentEmojis,
    },
  ];

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

export function Popover({
  children,
  trigger,
  open,
  onOpenChange,
  overlay = false,
  align,
  side,
  fallback,
}: {
  children: React.ReactNode;
  trigger: React.ReactElement<any, any>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overlay?: boolean;
  side?: Side;
  align?: Alignment | "center";
  fallback?: Placement[];
}) {
  const referenceRef = useRef<HTMLButtonElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  /**
   * gives the initial and ongoing positioning while the Popover is open
   * removes/cleans up the auto-update logic
   */
  useEffect(() => {
    if (!open || !referenceRef.current || !floatingRef.current) return;

    const cleanup = sharedAutoUpdatePosition({
      reference: referenceRef.current,
      floating: floatingRef.current,
      update: () => {
        customComputePosition(referenceRef.current!, floatingRef.current!, {
          align,
          side,
          fallback,
        });
      },
    });

    return cleanup;
  }, [open]);

  // Outside click
  useEffect(() => {
    if (!open) return;

    const cleanup = setupDismissListeners({
      safeElements: [referenceRef.current, floatingRef.current],
      onCancel: () => onOpenChange(false),
    });

    return cleanup;
  }, [open, onOpenChange]);

  const content = (
    <div ref={floatingRef} style={floatingStyles.base}>
      {children}
    </div>
  );

  return (
    <>
      {cloneElement(trigger, {
        ref: referenceRef,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          trigger.props.onClick?.(event);
          onOpenChange(!open);
        },
      })}

      {open ? (
        <>
          {createPortal(
            overlay ? (
              <div
                data-overlay-popover
                style={floatingStyles.overlay}
                onPointerDown={(e) => {
                  if (e.target === e.currentTarget) {
                    onOpenChange(false);
                  }
                }}
              >
                {content}
              </div>
            ) : (
              content
            ),
            document.body
          )}
        </>
      ) : null}
    </>
  );
}
