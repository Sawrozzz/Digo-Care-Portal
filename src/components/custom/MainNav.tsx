import { IconDashboard, IconUserShield } from "@tabler/icons-react";
import { GalleryVerticalEnd, AudioWaveform, Command } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarContent,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import { TeamSwitcher } from "../ui/team-switcher";

import { Outlet } from "react-router-dom";
import { NavMain } from "../ui/nav-main";
import { NavUser } from "../ui/nav-user";

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Company 1",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Company 2",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Company 3",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Admins",
      url: "/admins",
      icon: IconUserShield,
    },
  ],
};

export default function MainNav({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
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
