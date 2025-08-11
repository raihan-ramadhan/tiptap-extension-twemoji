import { DropzoneUploadProps } from "../types";

export const LOCAL_STORAGE_RECENT_EMOJIS_KEY = "recent-tiptap-emojis";
export const LOCAL_STORAGE_SKIN_TONE_KEY = "tiptap-emoji-skin-tone";
export const EMOJI_CLASS_NAME = "twemoji";
export const CUSTOM_EMOJI_CLASS_NAME = "custom-emoji";
export const EXTENSION_NAME = "emojiExtension";

export const COLUMNS = 12;

export const DEFAULT_ACCEPT: DropzoneUploadProps["accept"] = { "image/*": [] };
export const DEFAULT_MAX_SIZE: DropzoneUploadProps["maxSize"] =
  1000 * 1000 * 10; // 10MB;
export const DEFAULT_UPLOAD: DropzoneUploadProps["upload"] = async () => {};
export const DEFAULT_ON_ERROR: DropzoneUploadProps["onError"] = () => {};
export const DEFAULT_ON_SUCCESS: DropzoneUploadProps["onSuccess"] = () => {};
export const DEFAULT_MIN_CELLS_TO_HIDE_NAV: number = 60;
export const DEFAULT_VISIBLE_ROWS: number = 9;
export const DEFAULT_CELL_SIZE: number = 32;
