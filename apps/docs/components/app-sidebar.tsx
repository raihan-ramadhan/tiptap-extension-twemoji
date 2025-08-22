import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { ThemeDropdown } from "./dark-mode/theme-dropdown";
import MainRepoIcon from "./MainRepoIcon";
import { cn } from "../lib/utils";
import { NavUser } from "./nav-user";
import { createClient } from "../lib/supabase/server";
import { Button } from "./ui/button";

const ContributingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    height="16"
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    data-view-component="true"
    fill="#db61a2"
    {...props}
  >
    <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path>
  </svg>
);

// This is sample data.
const data = {
  versions: ["0.0.8"],
  navMain: [
    {
      title: "Getting Started",
      url: "",
      items: [
        {
          title: "Usage Guide",
          url: "usage",
          icon: null,
        },
        {
          title: "Custom Emojis",
          url: "custom-emojis",
          icon: null,
        },
        {
          title: "Deep Dive",
          url: "deep-dive",
          icon: null,
        },
      ],
    },
    {
      title: "API",
      url: "",
      items: [{ title: "Commands", url: "commands", icon: null }],
    },
    {
      title: "Components",
      url: "components",
      items: [
        {
          title: "EmojiPopoverTriggerWrapper",
          url: "emoji-popover-trigger-wrapper",
          icon: null,
        },
      ],
    },
    {
      title: "Support the Developer",
      url: "",
      items: [
        { title: "Sponsor & Hire Me", url: "support", icon: ContributingIcon },
      ],
    },
  ],
  navExamples: [
    {
      title: "Resources",
      url: "",
      items: [
        {
          title: "Example repo",
          url: "https://github.com/raihan-ramadhan/tiptap-extension-twemoji/tree/master/apps/example",
          icon: null,
        },
        {
          title: "Playground",
          url: "#",
          icon: null,
        },
      ],
    },
  ],
  navSoon: [
    {
      title: "Soon",
      url: "soon",
      items: [
        {
          title: "Vue, Svelte",
          url: "vue-svelte-version",
          icon: null,
        },
        {
          title: "Components",
          url: "components",
          icon: null,
        },
        {
          title: "Efficient Code Splitting",
          url: "efficient-code-splitting",
          icon: null,
        },
      ],
    },
  ],
};

export async function AppSidebar({
  pathname,
  ...props
}: React.ComponentProps<typeof Sidebar> & { pathname: string | null }) {
  const paths = pathname?.split("/").filter(Boolean);

  const buildUrl = (parentUrl: string, childUrl: string) => {
    if (!parentUrl || parentUrl === "") {
      return `/${childUrl}`;
    }
    return `/${parentUrl}/${childUrl}`;
  };

  const isActiveLink = (parentUrl: string, childUrl: string) => {
    const expectedPath = buildUrl(parentUrl, childUrl);
    return pathname === expectedPath;
  };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="px-2">
            <Link href="/">
              <div className="flex flex-col gap-2 leading-none">
                <h1 className="font-medium text-lg">
                  tiptap-extension-twemoji
                </h1>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* Main navigation sections */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveLink(item.url, subItem.url)}
                      className={cn(subItem.icon && "pr-1")}
                    >
                      <Link
                        href={buildUrl(item.url, subItem.url)}
                        className="flex justify-between"
                      >
                        {subItem.title}
                        {subItem.icon && (
                          <div className="py-1 px-1.5 rounded-sm bg-secondary border border-border">
                            <subItem.icon className="w-4 h-4" />
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Externa links */}
        {data.navExamples.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        target="_blank"
                        href={subItem.url}
                        className="flex justify-between"
                        rel="noopener noreferrer"
                      >
                        {subItem.title}
                        <ArrowUpRight className="mr-0.5" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Secondary navigation with collapsible sections */}
        <SidebarGroup>
          <SidebarMenu>
            {data.navSoon.map((item) => (
              <Collapsible
                key={item.title}
                className="group/collapsible"
                defaultOpen={paths && paths[0] === item.url}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden mr-0.5" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden mr-0.5" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActiveLink(item.url, subItem.url)}
                            >
                              <Link href={buildUrl(item.url, subItem.url)}>
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="h-min gap-1">
        <div className="flex w-full gap-1">
          {user ? (
            <NavUser
              user={{
                avatar: user.user_metadata?.avatar_url ?? "None",
                email: user.email ?? "None",
                name: user.user_metadata?.name ?? "None",
              }}
            />
          ) : (
            <ThemeDropdown />
          )}

          <Button variant={"secondary"} asChild>
            <MainRepoIcon className="!p-1.5 size-8" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
