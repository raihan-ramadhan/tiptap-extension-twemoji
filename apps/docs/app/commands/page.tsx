import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import Header from "@/components/Header";
import { createMetadata } from "@/lib/metadata";
import Content from "./content.mdx";
import TocSidebar from "../../components/toc-sidebar";

export const metadata = createMetadata({
  title: "Commands | tiptap-extension-twemoji docs",
  description: "API reference for commands provided by the TwemojiExtension.",
  path: "/commands",
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
