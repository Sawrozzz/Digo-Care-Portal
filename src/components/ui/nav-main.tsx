import { NavLink, useLocation } from "react-router-dom";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2 ">
        <SidebarMenu>
          {items.map((item) => {
            // 3. Determine if active (matches exactly or nested routes)
            const isActive =
              location.pathname === item.url ||
              location.pathname.startsWith(`${item.url}/`);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className="
  flex items-center gap-2 px-3 py-2 rounded-md
  text-(--text-primary)
  transition-colors duration-200

  hover:bg-(--sidebar-hover)

  data-[active=true]:bg-(--sidebar-active)
  data-[active=true]:text-(--color-primary)
"
                >
                  <NavLink
                    to={item.url}
                    className="flex items-center gap-2 px-3 py-2 rounded-md"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
