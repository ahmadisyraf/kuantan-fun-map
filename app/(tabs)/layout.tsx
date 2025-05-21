import BottomNavigation from "@/components/core/bottom-navigation";
import { ReactNode } from "react";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-[100dvh] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">{children}</div>
      <div className="h-[64px] pb-[env(safe-area-inset-bottom)] border-t-[1.9px] border-black bg-white z-50">
        <BottomNavigation />
      </div>
    </div>
  );
}
