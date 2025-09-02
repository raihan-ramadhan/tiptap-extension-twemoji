import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import Header from "../../components/Header";
import Content from "./content.mdx";
import { createMetadata } from "../../lib/metadata";
import TocSidebar from "../../components/toc-sidebar";
import { createClient } from "../../lib/supabase/server";
import { EMOJIS_TABLE_NAME } from "../../example/constants";

export const metadata = createMetadata({
  title: "Deep Dive | tiptap-extension-twemoji docs",
  description: "Explore all configuration options for the Twemoji Extension.",
  path: "/deep-dive",
});

export default async function Page() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  const supabase = await createClient();

  const { data, error } = await supabase.from(EMOJIS_TABLE_NAME).select("*");

  if (error) {
    console.error("Error fetching emojis:", error);
  }

  const customEmojis = await Promise.all(
    (data ?? []).map(async (emoji) => {
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
      <SidebarInset>
        <Header as="a" />
        <div className="p-4">
          <Content customEmojis={customEmojis} />
        </div>
      </SidebarInset>
      <TocSidebar />
    </SidebarProvider>
  );
}
