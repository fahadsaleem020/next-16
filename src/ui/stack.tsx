import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "@/utils/cn";

export type StackProps = ComponentPropsWithoutRef<"div">;

const Stack = forwardRef<HTMLDivElement, StackProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />;
});

export { Stack };
