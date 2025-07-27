import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { createClient } from "@/lib/supabase/server";
import { type CustomEmoji } from "@raihancodes/tiptap-extension-twemoji-react";
import { EMOJIS_TABLE_NAME } from "@/example/constants";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.from(EMOJIS_TABLE_NAME).select("*");

  if (error) {
    console.log(error.message);
  }

  return <SimpleEditor customEmojis={(data as CustomEmoji[]) || []} />;
}
