"use client";

import React, { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "../lib/utils";

type TocSidebarItem = { id: string; title: string; items?: TocSidebarItem[] };

const TocSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  const [toc, setToc] = useState<TocSidebarItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Collect all h2 sections and their nested h3s
    const sections = Array.from(document.querySelectorAll("section h2[id]"));
    const items = sections.map((h2) => {
      const section = h2.parentElement!;
      const children = Array.from(section.querySelectorAll("h3[id]"));
      const subItems = children.map((h3) => ({
        id: h3.id,
        title: h3.textContent || "",
      }));

      return {
        id: h2.id,
        title: h2.textContent || "",
        items: subItems,
      };
    });
    setToc(items);

    // Create observer for h2 and h3
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the first visible heading closest to top
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0].target.id);
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0.1,
      }
    );

    // Observe all h2 and h3
    sections.forEach((h2) => observer.observe(h2));
    sections.forEach((h2) => {
      const section = h2.parentElement!;
      const children = Array.from(section.querySelectorAll("h3[id]"));
      children.forEach((h3) => observer.observe(h3));
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Sidebar
      {...props}
      className="!border-l-0 hidden xl:block z-10 right-0  w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear sticky top-0 h-svh !text-xs"
      collapsible="none"
    >
      <SidebarContent className="bg-background scroll-auto scrollbar-hide h-full pb-4">
        <SidebarGroup>
          <SidebarGroupLabel>On this page</SidebarGroupLabel>
          <SidebarMenu className="gap-2 my-2">
            {toc.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "hover:bg-background active:bg-background inline text-secondary-foreground/50",
                    activeId === item.id && "text-foreground"
                  )}
                >
                  <a href={`#${item.id}`}>{item.title}</a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 mx-1 gap-2 py-1">
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            "hover:bg-background active:bg-background inline h-fit text-secondary-foreground/50",
                            activeId === item.id && "text-foreground"
                          )}
                        >
                          <a href={`#${item.id}`}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default TocSidebar;
