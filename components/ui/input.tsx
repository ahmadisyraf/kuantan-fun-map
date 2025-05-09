import { cn } from "@/utils/cn";
import { ComponentProps, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, type, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        disabled={disabled}
        className={cn(
          "bg-white border-[1.9px] border-black rounded-lg px-4 py-3 w-full text-black font-medium text-xs placeholder:text-gray-600 focus:outline-none",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
