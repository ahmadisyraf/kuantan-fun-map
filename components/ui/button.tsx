import { cn } from "@/lib/cn";
import React, { forwardRef, ButtonHTMLAttributes } from "react";

const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "text-xs font-bold bg-brand text-black border-[1.9px] border-black px-4 py-2 transition-transform active:translate-y-1 uppercase rounded-md",
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
