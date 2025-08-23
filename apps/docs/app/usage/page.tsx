import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import Content from "./content.mdx";
import { createMetadata } from "../../lib/metadata";
import Header from "../../components/Header";

export const metadata = createMetadata({
  title: "Usage | tiptap-extension-twemoji docs",
  description:
    "Get started with tiptap-extension-twemoji — learn how to install, set up, and render emojis in your Tiptap editor.",
  path: "/usage",
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
    </SidebarProvider>
  );
}
