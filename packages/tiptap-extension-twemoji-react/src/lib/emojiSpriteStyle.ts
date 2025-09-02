import { CUSTOM_EMOJI_CLASS_NAME, EMOJI_CLASS_NAME } from "../constants";

export function applyEmojiSpriteStyle({ spriteUrl }: { spriteUrl: string }) {
  if (document.getElementById("emoji-sprite-style")) return;

  const style = `
    .${EMOJI_CLASS_NAME} {
      background-image: url(${spriteUrl}) !important;
      background-repeat: no-repeat !important;
      display: inline-block !important;
      vertical-align: -0.1em !important;
      object-fit: contain !important;
      cursor: text;
      pointer-events: none;
    }
    .${CUSTOM_EMOJI_CLASS_NAME} {
      background-repeat: no-repeat !important;
      display: inline-block !important;
      vertical-align: -0.1em !important;
      object-fit: contain !important;
      width: 1em; 
      height: 1em;
      cursor: text;
      pointer-events: none;
    }
  `;

  const sheet = document.createElement("style");
  sheet.id = "emoji-sprite-style";
  sheet.innerHTML = style;
  document.head.appendChild(sheet);

  return sheet;
}
