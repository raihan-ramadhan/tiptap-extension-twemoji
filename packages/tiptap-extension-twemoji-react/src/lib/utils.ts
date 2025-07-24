import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const emojiSpriteUrl = new URL(
  "../assets/emoji-sprite.webp",
  import.meta.url
).href;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
