import { headers } from "next/headers";

import { SimpleEditor1 } from "@/components/tiptap-templates/simple/simple-editor-1";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import MainRepoIcon from "../components/MainRepoIcon";
import { createClient } from "../lib/supabase/server";
import { EMOJIS_TABLE_NAME } from "../example/constants";
import { CustomEmoji } from "@raihancodes/tiptap-extension-twemoji-react";
import { createMetadata } from "../lib/metadata";
import Header from "../components/Header";

export const metadata = createMetadata({
  title: "tiptap-extension-twemoji docs",
  description:
    "Documentation for tiptap-extension-twemoji — Tiptap extensions that bring high-quality Twemoji emoji support to your editor, available for React, Vue, and Svelte.",
});

export default async function Page() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  const supabase = await createClient();

  const { data, error } = await supabase.from(EMOJIS_TABLE_NAME).select("*");

  if (error) {
    console.error("Error fetching emojis:", error);
  }

  const customEmojis = (data ?? []) as CustomEmoji[];

  const customEmojisWithUrl = await Promise.all(
    customEmojis.map(async (emoji) => {
      const { data, error } = await supabase.storage
        .from("emojis")
        .createSignedUrl(emoji.url, 24 * 60 * 60); // 1 day expiration

      if (error) {
        console.error("Failed to get signed URL:", error);
        return { ...emoji, url: "" };
      }
      return { ...emoji, url: data.signedUrl };
    })
  );

  return (
    <SidebarProvider>
      <AppSidebar pathname={pathname} />
      <SidebarInset className="h-screen">
        <Header />
        <div className="flex flex-col p-4 flex-1 gap-3 overflow-hidden">
          <div className="mb-4 mt-8 center max-[767px]:hidden">
            <h1 className="text-4xl font-bold inline mr-2">
              tiptap-extension-twemoji (React)
            </h1>
            <MainRepoIcon className="size-9 align-bottom" />
          </div>
          <Alert className="flex gap-2 items-start">
            <div className="inline-block w-fit">
              <Badge variant="outline">Tip</Badge>
            </div>
            <AlertDescription>
              <p>
                Click the <b>“Add Emoji”</b> button, or type{" "}
                <code className="inline-block bg-gray-100 dark:bg-gray-800 text-[0.85em] rounded border border-border">
                  &nbsp;:smile
                </code>{" "}
                (starting with a space) in the editor.
              </p>
            </AlertDescription>
          </Alert>
          <SimpleEditor1 customEmojis={customEmojisWithUrl} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
