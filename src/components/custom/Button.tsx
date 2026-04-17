import { Button, type ButtonProps } from "../ui/button";
import { cn } from "../../lib/utils";
import * as Icons from "lucide-react";

interface CustomButtonWrapperProps extends Omit<ButtonProps, "variant"> {
  variantType?: "primary" | "secondary";
  iconName?: keyof typeof Icons;
}

export const CustomButton = ({
  variantType = "primary",
  iconName,
  className,
  children,
  ...props
}: CustomButtonWrapperProps) => {
  const variantStyles =
    variantType === "primary"
      ? "bg-(--color-primary) hover:opacity-90 text-white border-none shadow-md"
      : "bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md";

  const Icon = iconName ? (Icons[iconName] as React.ElementType) : null;

  return (
    <Button className={cn(variantStyles, className)} {...props}>
      {Icon && <Icon className="mr-1" />}
      {children}
    </Button>
  );
};
