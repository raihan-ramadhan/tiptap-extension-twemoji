import { createRef } from "react";

// UTILITIES
import { getEmojiSprite, getAttributes } from "@/lib/emoji-utils";

// ASSETS
import emojisSubstringIndexes from "@/assets/emoji-substring-index.json";
import emojiSprite from "./assets/emoji-sprite.webp";

// DATA
import emojis from "@/data/emoji-sprite-map";

// PLUGINS
import { InputPlugin } from "@/plugins/input-plugin";
import { EmojiCopyPlugin } from "@/plugins/copy-plugin";
import { EmojiPastePlugin } from "@/plugins/paste-plugin";
import { EmojiFallbackCleanupPlugin } from "@/plugins/emoji-fallback-cleanup-plugin";
import { isEmoji } from "@/lib/emoji-grid-utils";

// TYPES ONLY
import type { CommandProps, Range } from "@tiptap/core";
import type { SuggestionProps } from "@tiptap/suggestion";
import type { Emoji } from "@/data/emoji-sprite-map";
import type {
  MentionNodeAttrs,
  MentionOptions,
} from "@tiptap/extension-mention";
import type {
  ComponentEmojiMentionProps,
  UploadCustEmojiFunc,
  CustomEmoji,
  SuggestionItems,
  SelectEmojiFunc,
  EmojiListRef,
  StoredEmoji,
} from "@/types";

// TIPTAP
import Mention from "@tiptap/extension-mention";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";

// COMPONENTS & CONFIG
import {
  destroyVirtualElement,
  getVirtualElement,
  VirtualElement,
  updatePosition,
  eventsHooks,
} from "@/components/popover/config";
import EmojiGrid from "@/components/emoji-grid/EmojiGrid";

// STORE
import { latestCustomEmojis } from "@/store/custom-emojis-store";

// CONSTANTS
import { EMOJI_CLASS_NAME, LOCAL_STORAGE_RECENT_EMOJIS_KEY } from "@/constants";
export const ExtensionName = "emojiExtension";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    [ExtensionName]: {
      insertEmoji: (
        emoji: Emoji | CustomEmoji,
        range: Range
      ) => (props: CommandProps) => boolean;
    };
  }
}

export interface EmojiExtensionOptions extends MentionOptions {
  /**
   * Acceptable file types for upload.
   * @default 'image/*'
   */
  accept?: string;
  /**
   * Maximum number of files that can be uploaded.
   * @default 1
   */
  limit?: number;
  /**
   * Maximum file size in bytes.
   * @default 1000 * 1000 * 10
   */
  maxSize?: number;
  /**
   * Function to handle the upload process.
   */
  upload?: UploadCustEmojiFunc;
  /**
   * Callback for upload errors.
   */
  onError?: (errorMessage: string) => void;
  /**
   * Callback for successful uploads.
   */
  onSuccess?: (successMessage: string, callback?: () => void) => void;
  /**
   * Url for fetch image remotely.
   */
  spriteUrl?: string;
}

let component: ReactRenderer<EmojiListRef, ComponentEmojiMentionProps> | null =
  null;

let lastItems: SuggestionItems[] = [];

export function updateEmojiGridItems(newItem: CustomEmoji) {
  if (component && lastItems[0]) {
    const items: SuggestionItems[] = [
      {
        ...lastItems[0],
        filteredCustomEmojis: [
          ...(lastItems[0].filteredCustomEmojis ?? []),
          newItem,
        ],
      },
    ];

    component.updateProps({ items });
  }
}

const TwemojiExtension = Mention.extend<EmojiExtensionOptions>({
  name: ExtensionName,
  onCreate() {
    if (typeof document === "undefined") return; // for ssr

    if (document.getElementById("emoji-sprite-style")) return; // to avoid repeating style definitions

    const finalUrl = this.options.spriteUrl ?? emojiSprite;

    const style = `
    .${EMOJI_CLASS_NAME} {
      background-image: url(${finalUrl}) !important;
      background-repeat: no-repeat !important;
      display: inline-block !important;
      vertical-align: -0.1em !important;
      object-fit: contain !important;
    }
  `;

    const sheet = document.createElement("style");
    sheet.id = "emoji-sprite-style";
    sheet.innerHTML = style;
    document.head.appendChild(sheet);
  },
  addOptions() {
    return {
      ...(this.parent?.() ?? ({} as EmojiExtensionOptions)),
      limit: 1,
      accept: "image/*",
      upload: undefined,
      onError: undefined,
      onSuccess: undefined,
      spriteUrl: undefined,
      maxSize: 1000 * 1000 * 10, // 10MB
      suggestion: {},
    };
  },

  addAttributes() {
    return {
      ...(this.parent?.() ?? {}),
      "data-type": { default: "emoji" },
      src: { default: null },
      alt: { default: null },
      style: { default: null },
      draggable: { default: false },
      contenteditable: { default: false },
      class: { default: EMOJI_CLASS_NAME },
    };
  },
  parseHTML() {
    return [
      {
        tag: "img[data-type='emoji']",
        getAttrs: (dom) => {
          return {
            "data-type": dom.getAttribute("data-type"),
            src: dom.getAttribute("src"),
            alt: dom.getAttribute("alt"),
            style: dom.getAttribute("style"),
            draggable: dom.getAttribute("draggable"),
            contenteditable: dom.getAttribute("contenteditable"),
            class: dom.getAttribute("class"),
          };
        },
      },
    ];
  },
  renderHTML({ node }) {
    return ["img", mergeAttributes(node.attrs)];
  },
  addCommands() {
    return {
      insertEmoji:
        (data, range) =>
        ({ commands }) => {
          const start = range.from;
          let end = range.to;

          let attrs;

          if (isEmoji(data)) {
            attrs = getAttributes({
              data,
              styleOption: { type: "string" },
            });
          } else {
            attrs = {
              alt: data.label,
              src: data.url,
              draggable: false,
              style:
                "width:1em; height:1em; display:inline-block; margin:0 0.1em; vertical-align:-0.1em; object-fit: contain;",
            };
          }

          commands.deleteRange({
            from: start,
            to: end,
          });

          return commands.insertContent([
            {
              type: ExtensionName,
              attrs,
            },
            { type: "text", text: " " },
          ]);
        },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: ":",
        allow: ({ state, range }) => {
          const triggerText = state.doc.textBetween(
            range.from,
            range.to,
            undefined,
            "\ufffc"
          );

          // 1. Check minimum triggerText length (e.g. ":a" = 2)
          if (triggerText.length < 2) return false;

          const $pos = state.doc.resolve(range.from);

          // 2. Allow if at start of paragraph
          if ($pos.parentOffset === 0) {
            return true;
          }

          // 3. Check character before the ":" trigger
          const indexBefore = range.from - 1;

          if (indexBefore <= 0) {
            // at start of document
            return true;
          }

          const charBefore = state.doc.textBetween(indexBefore, range.from);

          // Allow only if charBefore is space or newline
          if (charBefore === " " || charBefore === "\n") {
            return true;
          }

          // 4. If the node before is a text node with no space, or an inline node like emoji – block it
          return false;
        },
        items: ({ query }) => {
          if (query !== "") {
            const lowerQuery = query.toLowerCase().trim();
            if (!lowerQuery) return [];

            const defaultCustomEmojis = latestCustomEmojis;

            const filteredCustomEmojis = defaultCustomEmojis.filter(
              ({ label }) => label.includes(lowerQuery)
            );

            const emojisIndexes = emojisSubstringIndexes as Record<
              string,
              string[]
            >;

            const matchedHexcodes = emojisIndexes[lowerQuery] ?? [];

            const filteredEmojis: Emoji[] = new Array(matchedHexcodes.length);

            for (let i = 0; i < matchedHexcodes.length; i++) {
              filteredEmojis[i] = emojis[matchedHexcodes[i]] as Emoji & {
                hexcode: string;
              };
            }

            const items: SuggestionItems[] = [
              {
                filteredEmojis,
                filteredCustomEmojis,
                recent: null,
              },
            ];

            const storedEmojis = localStorage.getItem(
              LOCAL_STORAGE_RECENT_EMOJIS_KEY
            );
            if (storedEmojis) {
              const parsedStoredEmojis = JSON.parse(
                storedEmojis
              ) as StoredEmoji[];

              items[0].recent = parsedStoredEmojis.map(
                ({ hexcode, ...rest }) => {
                  let emoji: Emoji | CustomEmoji;
                  if (hexcode) {
                    emoji = getEmojiSprite({ hexcode }) as Emoji & {
                      hexcode: string;
                    };
                  } else {
                    emoji = rest as CustomEmoji;
                  }
                  return emoji;
                }
              );
            }

            return items;
          }
          return [];
        },
        render: () => {
          // ref for access useImperativeHandle in EmojiList
          const ref = createRef<EmojiListRef>();

          let cleanup: (() => void) | null = null;

          const onCancel = () => {
            cleanup?.();
            cleanup = null;
            destroyVirtualElement(component);
          };

          const wrapper = document.querySelector(".content-wrapper"); // our editor

          return {
            onStart: ({
              editor,
              items,
              range,
            }: SuggestionProps<any, MentionNodeAttrs>) => {
              const onSelectEmoji: SelectEmojiFunc = ({
                baseHexcode,
                emoji,
                range,
              }) => {
                if (!range) return;

                const storedEmojis = localStorage.getItem(
                  LOCAL_STORAGE_RECENT_EMOJIS_KEY
                );
                if (storedEmojis) {
                  const parsedStoredEmojis = JSON.parse(
                    storedEmojis
                  ) as StoredEmoji[];

                  // check if the emoji is already in the array, if yes then made it first in the array
                  const index = parsedStoredEmojis.findIndex((e) =>
                    isEmoji(emoji)
                      ? e.hexcode === baseHexcode
                      : e.id === emoji.id
                  );

                  if (index !== -1) parsedStoredEmojis.splice(index, 1);

                  if (isEmoji(emoji)) {
                    parsedStoredEmojis.unshift({
                      hexcode: baseHexcode,
                    });
                  } else {
                    parsedStoredEmojis.unshift({
                      id: emoji.id,
                      label: emoji.label,
                      url: emoji.url,
                    });
                  }

                  localStorage.setItem(
                    LOCAL_STORAGE_RECENT_EMOJIS_KEY,
                    JSON.stringify(parsedStoredEmojis.slice(0, 24))
                  );
                } else {
                  localStorage.setItem(
                    LOCAL_STORAGE_RECENT_EMOJIS_KEY,
                    JSON.stringify([{ hexcode: baseHexcode }])
                  );
                }

                // call the command so that it replaces the : with the emoji
                editor.commands.insertEmoji(emoji, range);
              };

              const componentProps: ComponentEmojiMentionProps = {
                onSelectEmoji,
                onCancel,
                editor,
                items,
                range,
                ref,
                upload: this.options.upload,
                onError: this.options.onError,
                onSuccess: this.options.onSuccess,
              };

              lastItems = items;

              component = new ReactRenderer(EmojiGrid, {
                props: componentProps,
                editor,
              });

              const popoverComponent = component.element as HTMLDivElement;
              document.body.appendChild(popoverComponent);

              const virtualElement: VirtualElement = getVirtualElement(editor);

              cleanup =
                eventsHooks({
                  popoverComponent,
                  virtualElement,
                  onCancel,
                  editor,
                  wrapper,
                }) ?? null;

              updatePosition(
                virtualElement,
                popoverComponent,
                onCancel,
                wrapper
              );
            },
            onUpdate(props) {
              lastItems = props.items;

              component?.updateProps(props);

              if (!props.clientRect || !component) return;

              const virtualElement: VirtualElement = getVirtualElement(
                props.editor
              );

              document.body.appendChild(component.element);
              updatePosition(
                virtualElement,
                component.element as HTMLDivElement,
                onCancel,
                wrapper
              );
            },
            onKeyDown(props) {
              if (props.event.key === "Escape") {
                onCancel();
                return true;
              }

              if (ref.current?.onKeyDown) {
                return ref.current.onKeyDown(props);
              }

              return false;
            },
            onExit() {
              onCancel();
            },
          };
        },
        ...this.options.suggestion,
      }),
      EmojiPastePlugin,
      EmojiCopyPlugin,
      EmojiFallbackCleanupPlugin,
    ];
  },
  addInputRules() {
    return InputPlugin(this.type);
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          const { empty, anchor } = state.selection;

          if (!empty) {
            return false;
          }

          let isBackspaceHandled = false;

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === ExtensionName) {
              tr.deleteRange(pos, pos + node.nodeSize);
              isBackspaceHandled = true;
              return false;
            }
          });

          return isBackspaceHandled;
        }),
    };
  },
});

export { TwemojiExtension };
