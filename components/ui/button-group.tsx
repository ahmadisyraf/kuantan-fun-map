import * as React from "react";
import { cn } from "@/utils/cn";

type ButtonGroupContextType = {
  value: string | null;
  onChange: (value: string) => void;
};

const ButtonGroupContext = React.createContext<ButtonGroupContextType | null>(
  null
);

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | null;
  onValueChange: (value: string) => void;
}

export function ButtonGroup({
  value,
  onValueChange,
  className,
  ...props
}: ButtonGroupProps) {
  return (
    <ButtonGroupContext.Provider value={{ value, onChange: onValueChange }}>
      <div className={cn("inline-flex gap-2", className)} {...props} />
    </ButtonGroupContext.Provider>
  );
}

interface ButtonGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const ButtonGroupItem = React.forwardRef<
  HTMLButtonElement,
  ButtonGroupItemProps
>(({ value, children, className, ...props }, ref) => {
  const context = React.useContext(ButtonGroupContext);

  if (!context) {
    throw new Error("ButtonGroupItem must be used inside ButtonGroup");
  }

  return (
    <button
      ref={ref}
      onClick={() => context.onChange(value)}
      className={cn(
        "text-xs font-medium px-3 py-1 border-[1.9px] uppercase rounded-full transition-all",
        context.value === value
          ? "bg-brand text-black border-black"
          : "bg-black text-white border-black",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

ButtonGroupItem.displayName = "ButtonGroupItem";
