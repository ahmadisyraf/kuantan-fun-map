import BottomNavigation from "@/components/core/bottom-navigation";
import { ReactNode } from "react";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full relative">
      <div className="h-[92dvh] relative">{children}</div>
      <div className="h-[8dvh] z-50 w-full">
        <BottomNavigation />
      </div>
    </div>
  );
}
