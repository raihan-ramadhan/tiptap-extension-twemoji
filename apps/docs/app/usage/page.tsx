import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import Content from "./content.mdx";

export default async function Page() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  return (
    <SidebarProvider>
      <AppSidebar pathname={pathname} />
      <SidebarInset>
        <div className="p-4">
          <Content />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
