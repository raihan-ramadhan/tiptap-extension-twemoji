import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import Content from "./content.mdx";
import { createMetadata } from "../../lib/metadata";
import Header from "../../components/Header";
import TocSidebar from "../../components/toc-sidebar";

export const metadata = createMetadata({
  title: "Custom Emojis | tiptap-extension-twemoji docs",
  description:
    "Extend tiptap-extension-twemoji with custom emojis — learn how to handle uploads and apply your own emoji set in the editor.",
  path: "/custom-emojis",
});

export default async function Page() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  return (
    <SidebarProvider>
      <AppSidebar pathname={pathname} />
      <SidebarInset>
        <Header as="a" />
        <div className="p-4">
          <Content />
        </div>
      </SidebarInset>
      <TocSidebar />
    </SidebarProvider>
  );
}
