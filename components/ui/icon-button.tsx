import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "p-2 rounded-full bg-white text-gray-800 shadow-lg border-[1.9px] border-black hover:bg-gray-100 transition-transform active:translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

IconButton.displayName = "IconButton";

export { IconButton };
