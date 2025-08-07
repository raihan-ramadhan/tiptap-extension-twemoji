import { CustomEmoji } from "@raihancodes/tiptap-extension-twemoji-react";
import { create } from "zustand";

type Store = {
  latestCustomEmojis: CustomEmoji[];
  setLatestCustomEmojis: (emojis: CustomEmoji[]) => void;
};

const useCustomEmojiStore = create<Store>((set) => ({
  latestCustomEmojis: [],
  setLatestCustomEmojis: (emojis) => set({ latestCustomEmojis: emojis }),
}));

// Accessor functions
export const setLatestCustomEmojis = (emojis: CustomEmoji[]) => {
  useCustomEmojiStore.getState().setLatestCustomEmojis(emojis);
};

export const getLatestCustomEmojis = () => {
  return useCustomEmojiStore.getState().latestCustomEmojis;
};

export const addCustomEmoji = (emoji: CustomEmoji) => {
  const { latestCustomEmojis, setLatestCustomEmojis } =
    useCustomEmojiStore.getState();
  setLatestCustomEmojis([...latestCustomEmojis, emoji]);
};

export { useCustomEmojiStore };
