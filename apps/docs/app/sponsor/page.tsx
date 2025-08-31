import { headers } from "next/headers";
import { Coffee, Star } from "lucide-react";

import Header from "@/components/Header";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContributingIcon } from "@/components/ContributingIcon";
import { getStarCount } from "../../lib/github";
import { createMetadata } from "../../lib/metadata";

export const metadata = createMetadata({
  title:
    "Sponsor  — EmojiPopoverTriggerWrapper | tiptap-extension-twemoji docs",
  description:
    "Support Raihan, creator of tiptap-extension-twemoji. Sponsor on GitHub, buy a coffee, or hire for freelance Tiptap development.",
  path: "/sponsor",
});

export default async function Page() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  const starCount = await getStarCount();

  return (
    <SidebarProvider>
      <AppSidebar pathname={pathname} />
      <SidebarInset className="bg-muted">
        <Header as="a" />

        <div className="p-4 flex justify-center sm:items-center max-[768px]:pb-8 flex-1">
          <Card className="max-w-3xl w-full shadow-lg border ">
            <CardHeader>
              <CardTitle>Support Raihan</CardTitle>
              <CardDescription>
                Hi, I’m Raihan from Indonesia. I recently started building{" "}
                <span className="font-medium">Tiptap extensions</span>,
                beginning with a Twemoji integration. My goal is to grow into
                creating more tools that help developers build rich text editors
                faster and better.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <p>
                If you find my work useful, your support helps me maintain and
                improve these projects — and motivates me to keep contributing
                to the open-source community.
              </p>

              {/* Support buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Button asChild>
                  <a
                    href="https://github.com/sponsors/raihan-ramadhan/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub Sponsors
                    <ContributingIcon className="ml-2 fill-white" />
                  </a>
                </Button>

                <Button variant="secondary" asChild>
                  <a
                    href="https://ko-fi.com/raihancodes"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buy Me a Coffee
                    <Coffee className="ml-2" />
                  </a>
                </Button>

                <Button variant="outline" asChild>
                  <a
                    href="https://github.com/raihan-ramadhan/tiptap-extension-twemoji"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Star on GitHub {starCount !== null ? `(${starCount})` : ""}
                    <Star className={starCount ? "" : "ml-2"} />
                  </a>
                </Button>
              </div>

              <Separator className="my-2" />

              {/* Freelance work */}
              <p>
                I also offer freelance development and consulting for Tiptap
                projects{" "}
                <span className="font-medium">(starting at $20/hour)</span>.
                Contact me if you’d like custom features or support:{" "}
                <a
                  href="mailto:raihanramadhan.rn22@gmail.com"
                  className="text-blue-600 underline"
                >
                  raihanramadhan.rn22@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
