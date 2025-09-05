import { DOMSerializer } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { UNICODE_REGEX } from "@/data/emoji-regexes";

export const EmojiCopyPlugin = new Plugin({
  key: new PluginKey("EmojiCopyPlugin"),
  props: {
    handleDOMEvents: {
      copy: (view, event: ClipboardEvent) => {
        const { state } = view;
        const { schema, selection } = state;
        if (selection.empty) return false;

        /* ---------- Build an HTML fragment from the selection ---------- */
        const slice = selection.content();
        const div = document.createElement("div");
        const serializer = DOMSerializer.fromSchema(schema);
        slice.content.forEach((node) =>
          div.appendChild(serializer.serializeNode(node))
        );

        /* ---------- Pass 1:  make HTML a little friendlier ------------ */
        /* If the <img> already represents a true Unicode emoji,
           swap it out for the real character so HTML degrades gracefully.
           For custom emoji we KEEP the <img>.                           */
        Array.from(div.querySelectorAll("img[data-type='emoji']")).forEach(
          (img) => {
            const alt = img.getAttribute("alt") || "";
            if (UNICODE_REGEX.test(alt)) {
              img.replaceWith(document.createTextNode(alt));
            } else {
              const wrapper = document.createElement("span");

              // Clone the <img> or use the original if safe
              const clonedImg = img.cloneNode(true) as HTMLElement;

              // Add the hidden fallback
              const fallback = document.createElement("span");
              fallback.textContent = `[${alt}]`;
              fallback.setAttribute("style", "display:none");

              // Build and insert
              wrapper.appendChild(clonedImg);
              wrapper.appendChild(fallback);

              img.replaceWith(wrapper);
            }
          }
        );

        const plainText = div.innerText.trim();

        /* ---------- Write both flavours to the clipboard -------------- */
        event.preventDefault();
        event.clipboardData?.setData("text/html", div.innerHTML);
        event.clipboardData?.setData("text/plain", plainText);

        return true;
      },
    },
  },
});
