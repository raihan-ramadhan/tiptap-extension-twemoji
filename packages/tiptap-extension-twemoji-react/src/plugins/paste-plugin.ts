import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Slice, Fragment, Schema } from "@tiptap/pm/model";
import { ExtensionName } from "@/index";

import { getEmojiAttributes } from "@/lib/emoji-utils";
import { COMBINED_REGEX_PASTE } from "@/assets/emoji-regexes";

// Example function to replace text nodes like ":hug:" with an emoji node
function replaceEmojiInFragmentPaste(
  fragment: Fragment,
  schema: Schema
): Fragment {
  const newNodes: any[] = [];

  fragment.forEach((child) => {
    if (child.isText) {
      const text = child.text || "";
      let lastIndex = 0;
      const regex = COMBINED_REGEX_PASTE;

      let match;
      while ((match = regex.exec(text)) !== null) {
        const start = match.index;
        const end = regex.lastIndex;

        // Push text before match
        if (start > lastIndex) {
          newNodes.push(child.cut(lastIndex, start));
        }

        const attributes = getEmojiAttributes(match);

        let emojiNode;

        if (Object.keys(attributes).length !== 0) {
          emojiNode = schema.nodes[ExtensionName]?.create(attributes);
        }

        if (emojiNode) {
          newNodes.push(emojiNode);
        } else {
          // fallback to original text
          newNodes.push(child.cut(start, end));
        }

        lastIndex = end;
      }

      // Push remaining text
      if (lastIndex < text.length) {
        newNodes.push(child.cut(lastIndex));
      }
    } else if (child.content && child.content.size > 0) {
      const newContent = replaceEmojiInFragmentPaste(child.content, schema);
      newNodes.push(child.copy(newContent));
    } else {
      newNodes.push(child);
    }
  });

  return Fragment.fromArray(newNodes);
}

export const EmojiPastePlugin = new Plugin({
  key: new PluginKey("EmojiPastePlugin"),
  props: {
    transformPasted(slice, editorState) {
      const { state } = editorState;
      const { schema } = state;

      const newContent = replaceEmojiInFragmentPaste(slice.content, schema);
      return new Slice(newContent, slice.openStart, slice.openEnd);
    },
  },
});
