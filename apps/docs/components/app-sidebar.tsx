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
import { ContributingIcon } from "./ContributingIcon";

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
