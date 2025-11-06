import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "@/utils/cn";

export type FlexProps = ComponentPropsWithoutRef<"div">;

const Flex = forwardRef<HTMLDivElement, FlexProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex gap-2 items-center", className)} {...props} />;
});

export { Flex };
