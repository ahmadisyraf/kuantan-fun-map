import { cn } from "@/utils/cn";
import { forwardRef, ReactNode, HTMLAttributes } from "react";

interface TabsSafeZoneProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const TabsSafeZone = forwardRef<HTMLDivElement, TabsSafeZoneProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        // className={cn("py-[calc(40px+env(safe-area-inset-top))] px-5", className)}
        className={cn(
          "w-full h-[calc(100dvh-10dvh-env(safe-area-inset-bottom))] relative",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsSafeZone.displayName = "TabsSafeZone";

export default TabsSafeZone;
