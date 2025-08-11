import { DropzoneUploadProps } from "../types";

export const LOCAL_STORAGE_RECENT_EMOJIS_KEY = "recent-tiptap-emojis";
export const LOCAL_STORAGE_SKIN_TONE_KEY = "tiptap-emoji-skin-tone";
export const EMOJI_CLASS_NAME = "twemoji";
export const CUSTOM_EMOJI_CLASS_NAME = "custom-emoji";
export const EXTENSION_NAME = "emojiExtension";

export const COLUMNS = 12;
export const CELL_HEIGHT = 32;
export const MAX_VISIBLE_ROW = 9;

export const DEFAULT_ACCEPT: DropzoneUploadProps["accept"] = { "image/*": [] };
export const DEFAULT_MAX_SIZE = 1000 * 1000 * 10; // 10MB;
export const DEFAULT_UPLOAD = async () => {};
export const DEFAULT_ON_ERROR = () => {};
export const DEFAULT_ON_SUCCESS = () => {};
