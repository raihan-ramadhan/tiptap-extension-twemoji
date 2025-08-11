import {
  CustomEmoji,
  EmojiUploadProps,
} from "@raihancodes/tiptap-extension-twemoji-react";
import { createClient } from "@/lib/supabase/client";
import { EMOJIS_BUCKET_NAME, EMOJIS_TABLE_NAME } from "@/example/constants";
import { addCustomEmoji } from "../store/custom-emojis-store";

export const handleEmojiUpload: EmojiUploadProps["upload"] = async ({
  emojiName,
  files,
  onSuccess,
  onError,
  callback,
}) => {
  /**
   * The number of seconds the asset is cached in the browser and in the Supabase CDN.
   *
   * This is set in the Cache-Control: max-age=<seconds> header. Defaults to 3600 seconds.
   */
  const cacheControl = 3600;

  const supabase = createClient();
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
    return onError?.(uploadError.message ?? "Upload Error");
  }

  const objectPath = uploadData.path;
  const { data: urlData } = supabase.storage
    .from(EMOJIS_BUCKET_NAME)
    .getPublicUrl(objectPath);
  const imageUrl = urlData.publicUrl;

  const { error: insertError, data } = await supabase
    .from(EMOJIS_TABLE_NAME)
    .insert({
      url: imageUrl,
      label: emojiName,
    })
    .select("*");

  if (insertError) {
    return onError?.(insertError.message);
  }

  onSuccess?.(`${emojiName} has added your workspace`, callback);

  addCustomEmoji(data[0] as CustomEmoji);

  return;
};
