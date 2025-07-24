import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { createClient } from "@/lib/supabase/server";
import { type FetchedCustomEmoji } from "@raihancodes/tiptap-extension-twemoji-react";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("custom_emoji").select("*");

  if (error) {
    console.log(error.message);
  }

  return <SimpleEditor customEmojis={(data as FetchedCustomEmoji[]) || []} />;
}
