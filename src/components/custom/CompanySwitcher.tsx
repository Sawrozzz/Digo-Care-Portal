import { ChevronsUpDown, Building2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { type Company } from "../../utils";
import { useCompanyStore } from "../../zustand/companyStore";
import { useAuthStore } from "../../zustand/authStore";

import { BASE_URL } from "../../utils";

export function CompanySwitcher() {
  const { isMobile } = useSidebar();
  const { activeCompany, setActiveCompany, companies, loading } =
    useCompanyStore();
  const account = useAuthStore((state) => state.account);

  const isSuperAdmin = account?.role === "super_admin";

  if (loading)
    return <div className="p-4 text-xs animate-pulse">Loading...</div>;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <CompanyLogo company={activeCompany} size="large" />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeCompany?.name || "No Company"}
                </span>
                <span className="truncate text-xs capitalize text-muted-foreground">
                  {activeCompany?.status || "Not assigned"}
                </span>
              </div>

              {isSuperAdmin && companies.length > 1 && (
                <ChevronsUpDown className="ml-auto size-4" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {isSuperAdmin && (
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Available Companies
              </DropdownMenuLabel>

              {companies.length > 0 ? (
                companies.map((company) => {
                  return (
                    <DropdownMenuItem
                      key={company.id}
                      onClick={() => setActiveCompany(company)}
                      className="gap-2 p-2 cursor-pointer"
                    >
                      <CompanyLogo company={company} size="small" />

                      <span className="flex-1 truncate">{company.name}</span>
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <div className="p-2 text-xs text-muted-foreground text-center">
                  No companies available
                </div>
              )}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const CompanyLogo = ({
  company,
  size = "large",
}: {
  company: Company | null;
  size?: "small" | "large";
}) => {
  const containerClasses =
    size === "large" ? "size-8 rounded-lg" : "size-6 rounded-md";
  const iconClasses = size === "large" ? "size-4" : "size-3";

  if (!company) {
    return (
      <div
        className={`flex items-center justify-center bg-sidebar-primary ${containerClasses}`}
      >
        <Building2
          className={`${iconClasses} text-sidebar-primary-foreground/70`}
        />
      </div>
    );
  }

  const avatarUrl = company.avatar?.url;

  return (
    <div
      className={`flex aspect-square items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden border ${containerClasses}`}
    >
      {avatarUrl ? (
        <img
          src={
            avatarUrl.startsWith("http") ? avatarUrl : `${BASE_URL}${avatarUrl}`
          }
          alt={company.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <Building2
          className={`${iconClasses} text-sidebar-primary-foreground/70`}
        />
      )}
    </div>
  );
};
