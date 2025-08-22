import { headers } from "next/headers";

import { SimpleEditor1 } from "@/components/tiptap-templates/simple/simple-editor-1";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import MainRepoIcon from "../components/MainRepoIcon";
import { createClient } from "../lib/supabase/server";
import { EMOJIS_TABLE_NAME } from "../example/constants";
import { CustomEmoji } from "@raihancodes/tiptap-extension-twemoji-react";

export default async function Page() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  const supabase = await createClient();

  const { data, error } = await supabase.from(EMOJIS_TABLE_NAME).select("*");

  if (error) {
    console.error("Error fetching emojis:", error);
  }

  const customEmojis = (data ?? []) as CustomEmoji[];

  return (
    <SidebarProvider>
      <AppSidebar pathname={pathname} />
      <SidebarInset className="h-screen">
        <div className="flex flex-col p-4 flex-1 gap-3 overflow-hidden">
          <div className="mb-4 mt-8 center">
            <h1 className="text-4xl font-bold inline">
              tiptap-extension-twemoji (React)
            </h1>
            <MainRepoIcon className="size-9 align-bottom ml-2" />
          </div>
          <Alert className="flex gap-2 items-center">
            <div className="inline-block w-fit">
              <Badge variant="outline">Tip</Badge>
            </div>
            <AlertTitle>
              <p>
                Click the <b>“Add Emoji”</b> button, or type{" "}
                <code className="inline-block bg-gray-100 dark:bg-gray-800 text-[0.85em] rounded border border-border">
                  &nbsp;:smile
                </code>{" "}
                (starting with a space) in the editor.
              </p>
            </AlertTitle>
          </Alert>
          <SimpleEditor1 customEmojis={customEmojis} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
