import { FetchedCustomEmoji } from "@/types";

export let latestCustomEmojis: FetchedCustomEmoji[] = [];

export function setLatestCustomEmojis(emojis: FetchedCustomEmoji[]) {
  latestCustomEmojis = emojis;
}
