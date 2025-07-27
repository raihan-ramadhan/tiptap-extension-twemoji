import { CustomEmoji } from "@/types";

export let latestCustomEmojis: CustomEmoji[] = [];

export function setLatestCustomEmojis(emojis: CustomEmoji[]) {
  latestCustomEmojis = emojis;
}
