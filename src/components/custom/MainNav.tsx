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

import { PageTransition } from "./PageTransitionWrapper";

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
      {/* Sidebar */}
      <Sidebar
        collapsible="offcanvas"
        className="bg-(--bg-sidebar) border-r border-(--border-color)"
        {...props}
      >
        <SidebarHeader className="border-b border-(--border-color) p-4">
          <CompanySwitcher />
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <NavMain items={filteredNav} />
        </SidebarContent>

        <SidebarFooter className="border-t border-(--border-color) p-3">
          <UserNav />
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <SidebarInset>
        <div className="@container/main flex flex-1 flex-col bg-(--bg-main)">
          {/* Page wrapper */}
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
