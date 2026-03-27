import { useState } from "react";

import { CustomButton } from "../custom/Button";
import { Loader } from "../custom/Loader";
import { Separator } from "./separator";
import { SidebarTrigger } from "./sidebar";

interface SiteHeaderProps {
  name?: string;
}
export function SiteHeader({ name }: SiteHeaderProps) {
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" />
        <h1 className="text-base font-medium">{name || "Content"}</h1>
        <div className="ml-auto flex items-center gap-2">
          <CustomButton
            className="hidden sm:flex cursor-pointer items-center gap-2"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading && <Loader className="text-white" />}
            {loading ? "Refreshing" : "Refresh"}
          </CustomButton>
        </div>
      </div>
    </header>
  );
}
