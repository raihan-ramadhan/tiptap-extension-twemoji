import {
  CustomEmoji,
  EmojiUploadProps,
} from "@raihancodes/tiptap-extension-twemoji-react";
import { createClient } from "@/lib/supabase/client";
import { EMOJIS_BUCKET_NAME, EMOJIS_TABLE_NAME } from "@/example/constants";
import { addCustomEmoji } from "../store/custom-emojis-store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

export const handleEmojiUpload: EmojiUploadProps["upload"] = async ({
  emojiName,
  files,
  handleSuccess,
  handleError,
  dismiss,
}) => {
  const supabase = createClient();

  /**
   * The number of seconds the asset is cached in the browser and in the Supabase CDN.
   *
   * This is set in the Cache-Control: max-age=<seconds> header. Defaults to 3600 seconds.
   */
  const cacheControl = 3600;

  const randomSuffix = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

  const baseName = `${emojiName}-${randomSuffix}`;
  const fullPath = baseName;

  const { error: uploadError, data: uploadData } = await supabase.storage
    .from(EMOJIS_BUCKET_NAME)
    .upload(fullPath, files, {
      cacheControl: cacheControl.toString(),
      upsert: false,
    });

  if (uploadError || !uploadData) {
    return handleError?.(uploadError.message ?? "Upload Error");
  }

  const objectPath = uploadData.path;

  const { error: insertError, data } = await supabase
    .from(EMOJIS_TABLE_NAME)
    .insert({
      url: objectPath,
      label: emojiName,
    })
    .select("*");

  if (insertError) {
    return handleError?.(insertError.message);
  }

  handleSuccess?.(`${emojiName} has added your workspace`, dismiss);

  const customEmojisWithUrl = await Promise.all(
    data.map(async (emoji) => {
      const { data, error } = await supabase.storage
        .from("emojis")
        .createSignedUrl(emoji.url, 900); // 15 minutes expiration

      if (error) {
        console.error("Failed to get signed URL:", error);
        return { ...emoji, url: "" };
      }
      return { ...emoji, url: data.signedUrl };
    })
  );

  addCustomEmoji(customEmojisWithUrl[0] as CustomEmoji);

  return;
};

export const handleEmojiOnSuccess = (
  successMessage: Parameters<EmojiUploadProps["onSuccess"]>[0],
  dismiss: Parameters<EmojiUploadProps["onSuccess"]>[1],
  router: AppRouterInstance
) => {
  toast.success(successMessage);
  dismiss?.();
  router.refresh();
};

export const handleEmojiOnError = (
  errorMessage: Parameters<EmojiUploadProps["onError"]>[0]
) => {
  toast.error(errorMessage);
};

export const handleInterceptAddCustomEmoji = async (
  openLoginDialog: () => void
) => {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    openLoginDialog();
    return true;
  }

  return false;
};
