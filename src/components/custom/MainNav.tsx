import {
  SidebarInset,
  SidebarProvider,
  SidebarContent,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import { CompanySwitcher } from "./CompanySwitcher";

import { Outlet } from "react-router-dom";
import { NavMain } from "../ui/nav-main";
import UserNav from "./UserNav";
import { useNavItem } from "../../hooks/use-nav-item";
import { navItems } from "../../utils";

export default function MainNav({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const filteredNav = useNavItem(navItems);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <CompanySwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={filteredNav} />
        </SidebarContent>
        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
