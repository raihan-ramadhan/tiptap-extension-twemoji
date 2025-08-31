import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Content from "./content.mdx";
import { createMetadata } from "@/lib/metadata";
import TocSidebar from "../../../components/toc-sidebar";

export const metadata = createMetadata({
  title: "Coming Soon Components | tiptap-extension-twemoji docs",
  description:
    "Coming soon: new Tiptap emoji components—mobile emoji picker, emoji drawer, custom icons plugin, and more tools to enhance your Tiptap editor.",
  path: "/soon/components",
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
