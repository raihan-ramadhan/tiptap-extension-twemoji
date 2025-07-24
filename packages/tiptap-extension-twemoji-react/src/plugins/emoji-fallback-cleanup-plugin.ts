import { Plugin, PluginKey } from "@tiptap/pm/state";

export const EmojiFallbackCleanupPlugin = new Plugin({
  key: new PluginKey("EmojiFallbackCleanupPlugin"),
  props: {
    /**
     * This runs before Tiptap parses the pasted HTML into ProseMirror nodes.
     * So it's the right place to strip invisible fallback text.
     */
    transformPastedHTML(html: string): string {
      const container = document.createElement("div");
      container.innerHTML = html;

      container.querySelectorAll("span").forEach((span) => {
        const style = span.getAttribute("style") || "";
        if (style.includes("display:none")) {
          span.remove();
        }
      });

      return container.innerHTML;
    },
  },
});
