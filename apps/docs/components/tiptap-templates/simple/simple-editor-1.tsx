"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useRouter } from "next/navigation";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import {
  CustomEmoji,
  TwemojiExtension,
} from "@raihancodes/tiptap-extension-twemoji-react";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/simple/simple-editor-1.scss";

// --- Data ---
import content from "@/components/tiptap-templates/simple/data/content.json";

// --- Components ---
import IconFileButton from "@/components/IconFileButton";
import EditorLoading from "@/components/EditorLoading";
import {
  handleEmojiOnError,
  handleEmojiOnSuccess,
  handleEmojiUpload,
  handleInterceptAddCustomEmoji,
} from "@/lib/handleEmoji";

import { setLatestCustomEmojis } from "@/store/custom-emojis-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import { LoginForm } from "../../login-form";
import { useIsMobile } from "../../../hooks/use-mobile";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export function SimpleEditor1({
  customEmojis,
}: {
  customEmojis: CustomEmoji[];
}) {
  const router = useRouter();

  const loadingBarRef = React.useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = React.useState(false);

  const isMobile = useIsMobile();

  const [input, setInput] = React.useState("😃 🥰 🤩");

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          "aria-label": "Main content area, start typing to enter text.",
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleClickOn(view, pos, node, nodePos, event, direct) {
          const target = event.target as HTMLElement;
          if (target.tagName === "A") {
            const href = target.getAttribute("href");
            const targetAttribute = target.getAttribute("target");

            if (href && targetAttribute === "_self") {
              event.preventDefault();
              event.stopPropagation();
              router.push(href); // SPA navigation
              return true; // indicate we handled it
            }
          }
          return false; // let default behavior continue
        },
      },
      extensions: [
        StarterKit.configure({
          horizontalRule: false,
          link: {
            enableClickSelection: true,
          },
        }),
        HorizontalRule,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Highlight.configure({ multicolor: true }),
        Image,
        Typography,
        Superscript,
        Subscript,
        Selection,
        ImageUploadNode.configure({
          accept: "image/*",
          maxSize: MAX_FILE_SIZE,
          limit: 3,
          upload: handleImageUpload,
          onError: (error) => console.error("Upload failed:", error),
        }),
        TwemojiExtension.configure({
          gridOptions: {
            cellSize: isMobile ? 24 : undefined,
          },
          customEmojiOptions: {
            upload: (props) => handleEmojiUpload(props),
            onSuccess: (successMessage, callback) =>
              handleEmojiOnSuccess(successMessage, callback, router),
            onError: (errorMessage) => handleEmojiOnError(errorMessage),
            interceptAddEmojiClick: (dismiss) =>
              handleInterceptAddCustomEmoji(() => {
                dismiss?.();
                setIsOpen(true);
              }),
          },
        }),
      ],
      content,
      onBeforeCreate: () => {
        if (loadingBarRef.current) {
          const bar = loadingBarRef.current;
          bar.style.transition = "width 0.3s ease-in-out";
          bar.style.width = "100%";
        }
      },
    },
    [isMobile]
  );

  React.useEffect(() => {
    setLatestCustomEmojis(customEmojis);

    if (editor) {
      editor.commands.updateCustomEmojis(customEmojis);
    }
  }, [editor, customEmojis]);

  if (!editor) {
    return <EditorLoading barRef={loadingBarRef} />;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-sm">
          <DialogTitle className="text-2xl">Welcome!</DialogTitle>
          <DialogDescription>
            Sign in to your account to upload emoji
          </DialogDescription>
          <LoginForm />
        </DialogContent>
      </Dialog>
      <div className="simple-editor-wrapper">
        <EditorContext.Provider value={{ editor }}>
          <div className="simple-editor-content ">
            <div className="mt-2 mb-4 flex justify-between w-full flex-wrap gap-2">
              <IconFileButton setIsOpen={setIsOpen} />
              <div className="flex gap-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-24"
                />
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    if (editor) editor.commands.insertUnicodeEmoji(input);
                  }}
                >
                  <span className="text-xs">Insert</span>
                </Button>
              </div>
            </div>
            <div className="mt-2 mb-4"></div>
            <EditorContent editor={editor} role="presentation" />
          </div>
        </EditorContext.Provider>
      </div>
    </>
  );
}
