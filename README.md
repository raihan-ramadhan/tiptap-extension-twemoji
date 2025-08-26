# tiptap-extension-twemoji-react

> A Tiptap emoji extension built with React, inspired by the emoji picker in Notion.

### If you like this project, ⭐ [give it a star](https://github.com/raihan-ramadhan/tiptap-extension-twemoji), 🎉 [become a sponsor](https://github.com/sponsors/raihan-ramadhan) or ☕ [buy me a coffee](https://ko-fi.com/raihancodes)

## Key Features

- 🐦️ Twemoji rendering for cross-platform consistency
- ✨️ Suggested items displayed in a picker grid UI
- ⬆️⬇️ Arrow key & Tab navigation for fast selection
- 🎨 Skin tone selector for diverse emoji usage
- 🆕 Custom emoji support with reactive updates
- 📋️ Copy & paste functionality — convert between normal emoji and Twemoji (both ways)
- 🔤 Shortcodes support (e.g., `:hug:`, `:heart:`)
- 😄 Emoticon support (e.g., `:)`, `XD`, `:P`)
- 🌙 Dark Mode support (for Tailwind)
- 📑 Virtualised emoji list — powered by react-window, handles 2000+ emojis efficiently
- 🖼️ Grid Layout — 12-column grid with group titles 📂 and tooltips 🏷️
- 🧩 Components — ready-to-use UI building blocks (e.g., EmojiDrawer, EmojiPopoverTriggerWrapper)

## Installation

```bash
# PNPM
pnpm add @raihancodes/tiptap-extension-twemoji-react

# NPM
npm install @raihancodes/tiptap-extension-twemoji-react
```

## Example usage

### 1. Import the extension and add it to your editor:

```tsx
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TwemojiExtension } from "@raihancodes/tiptap-extension-twemoji-react";

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit, TwemojiExtension],
  });

  return <EditorContent editor={editor} />;
}
```

### 2. Move the Twemoji sprite sheet to public/assets/

Download the image from [here](https://github.com/raihan-ramadhan/tiptap-extension-twemoji/tree/master/packages/tiptap-extension-twemoji-react/dist/assets) then move it to your `public/assets/` folder. The image location can be anywhere in your public or on CDN, see [here](https://tiptap-extension-twemoji.vercel.app/deep-dive#spriteUrl) to adjust `spriteUrl`

### 3. Congratulations! Twemoji is now working in your editor.

## Using Predefined Custom Emojis

```tsx
// components/Editor.tsx
import * as React from "react";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import {
  TwemojiExtension,
  CustomEmoji,
} from "@raihancodes/tiptap-extension-twemoji-react";

export default function Editor() {
  const editor = useEditor({ extensions: [StarterKit, TwemojiExtension] });

  const customEmojis: CustomEmoji[] = [
    {
      id: "8177849e-c2c9-424a-a914-ff128ce439c5",
      created_at: "2025-08-09T00:26:09.143473+00:00",
      label: "github-icon",
      url: "...",
    },
    {
      id: "cecf7043-80da-4e3f-b167-6a85de0e464a",
      created_at: "2025-08-09T01:23:15.144872+00:00",
      label: "npm-icon",
      url: "...",
    },
  ];

  React.useEffect(() => {
    if (editor) {
      editor.commands.updateCustomEmojis(customEmojis);
    }
  }, [editor]);

  return <EditorContent editor={editor} />;
}
```

## Using Custom Emojis from Database

Example: Fetching custom emojis from your database

```tsx
// page.tsx
import { CustomEmoji } from "@raihancodes/tiptap-extension-twemoji-react";

export default async function Page() {
  const { data, error } = await supabase.from("emojis").select("*");

  if (error) {
    console.error("Error fetching emojis:", error);
  }

  const customEmojis = (data ?? []) as CustomEmoji[];

  return <Editor customEmojis={customEmojis} />;
}
```

Handling Emoji Uploads and Applying Fetched Emojis

```tsx
"use client";

// components/Editor.tsx

import * as React from "react";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import {
  EmojiUploadProps,
  TwemojiExtension,
  CustomEmoji,
} from "@raihancodes/tiptap-extension-twemoji-react";

export default function Editor({
  customEmojis,
}: {
  customEmojis: CustomEmoji[];
}) {
  const handleEmojiUpload: EmojiUploadProps["upload"] = async ({
    emojiName,
    files,
    handleSuccess,
    handleError,
    dismiss,
  }) => {
    // your code
  };

  const handleEmojiOnError: EmojiUploadProps["onError"] = (errorMessage) => {
    // your code
  };

  const handleEmojiOnSuccess: EmojiUploadProps["onSuccess"] = (
    successMessage,
    callback
  ) => {
    // your code
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TwemojiExtension.configure({
        customEmojiOptions: {
          upload: handleEmojiUpload,
          onSuccess: handleEmojiOnSuccess,
          onError: handleEmojiOnError,
        },
      }),
    ],
  });

  // Applying Fetched Emojis
  React.useEffect(() => {
    if (editor) {
      editor.commands.updateCustomEmojis(customEmojis);
    }
  }, [editor, customEmojis]);

  return <EditorContent editor={editor} />;
}
```

### Choose the approach that best fits your needs

## Coming Soon

- **Svelte & Vue support** – Use the extension in more frameworks.
- **Emoji Drawer** – A mobile-friendly emoji picker, inspired by Notion.
- **Icon Support** – Icons for file identifier / metadata, just like in Notion.
- **Performance Optimizations** – Making the package smaller and faster.

## License

MIT © [Raihan Ramadhan](https://github.com/raihan-ramadhan/)
