import { cn } from "@/utils/cn";
import React, { forwardRef, ButtonHTMLAttributes } from "react";

const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "text-xs font-bold bg-primary text-black border-[1.9px] border-black px-4 py-2 transition-transform active:translate-y-1 uppercase rounded-md",
        disabled &&
          "opacity-70 cursor-not-allowed active:translate-y-0 pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
