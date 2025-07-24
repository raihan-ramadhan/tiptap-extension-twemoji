import { NodeType } from "@tiptap/pm/model";
import { InputRule } from "@tiptap/react";
import { callOrReturn, ExtendedRegExpMatchArray } from "@tiptap/core";
import { getEmojiAttributes } from "@/lib/emoji-utils";
import {
  EMOTICON_REGEX,
  SHORTCODES_REGEX,
  UNICODE_REGEX,
} from "@/assets/emoji-regexes";

function customNodeInputRule({
  find,
  type,
  getAttributes,
}: {
  find: RegExp;
  type: NodeType;
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any>)
    | false
    | null;
}) {
  return new InputRule({
    find,
    handler: ({ state, range, match }) => {
      const attributes = callOrReturn(getAttributes, undefined, match) || {};
      const newNode = type.create(attributes);

      const { tr, schema } = state;
      const start = range.from;
      let end = range.to;

      const space = schema.text(" ");

      if (match[1]) {
        const offset = match[0].lastIndexOf(match[1]);
        let matchStart = start + offset;

        if (matchStart > end) {
          matchStart = end;
        } else {
          end = matchStart + match[1].length;
        }

        // insert last typed character
        const lastChar = match[0][match[0].length - 1];

        tr.insertText(lastChar, start + match[0].length - 1);

        // insert node from input rule
        tr.replaceWith(matchStart, end, newNode);

        // Insert space after inserted node
        tr.insert(matchStart + newNode.nodeSize, space);
      } else if (match[0]) {
        const insertionStart = type.isInline ? start : start - 1;

        tr.insert(insertionStart, type.create(attributes)).delete(
          tr.mapping.map(start),
          tr.mapping.map(end)
        );

        // Insert space after inserted node
        tr.insert(insertionStart + newNode.nodeSize, space);
      }

      tr.scrollIntoView();
    },
  });
}

export const InputPlugin = (type: NodeType) => {
  return [SHORTCODES_REGEX, EMOTICON_REGEX, UNICODE_REGEX].map((regex) =>
    customNodeInputRule({
      find: regex,
      type,
      getAttributes: getEmojiAttributes,
    })
  );
};
