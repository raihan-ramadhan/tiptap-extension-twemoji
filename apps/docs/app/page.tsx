import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { headers } from "next/headers";
import { SimpleEditor1 } from "../components/tiptap-templates/simple/simple-editor-1";
import { Alert, AlertTitle } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";

export default async function Page() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  return (
    <SidebarProvider>
      <AppSidebar pathname={pathname} />
      <SidebarInset className="!flex-1 !flex !overflow-hidden !h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-col p-4 flex-1 m-1.5 gap-3 overflow-hidden">
          <h1 className="text-4xl font-bold my-4">
            tiptap-extension-twemoji (React)
          </h1>
          <Alert className="flex gap-2 items-center">
            <div className="inline-block w-fit">
              <Badge variant="outline">Tip</Badge>
            </div>
            <AlertTitle>
              <p>
                Click the <b>“Add Emoji”</b> button, or type{" "}
                <code className="inline-block bg-gray-100 rounded border border-border">
                  &nbsp;:smile
                </code>{" "}
                (starting with a space) in the editor.
              </p>
            </AlertTitle>
          </Alert>
          <SimpleEditor1 />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
