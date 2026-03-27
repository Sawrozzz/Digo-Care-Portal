import { IconLoader } from "@tabler/icons-react";
import { cn } from "../../lib/utils";

interface LoaderProps {
  className?: string;
  size?: number | string;
}

export function Loader({ className, size = 20 }: LoaderProps) {
  return (
    <IconLoader
      size={size}
      className={cn("animate-spin text-muted-foreground", className)}
    />
  );
}
