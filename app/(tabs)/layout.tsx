import BottomNavigation from "@/components/core/bottom-navigation";
import { ReactNode } from "react";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full relative h-[100dvh] overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto h-[calc(100dvh-64px-env(safe-area-inset-bottom))]">
        {children}
      </div>
      <div className="z-50 w-full h-[calc(64px+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] border-t-2 border-black bg-white">
        <BottomNavigation />
      </div>
    </div>
  );
}
