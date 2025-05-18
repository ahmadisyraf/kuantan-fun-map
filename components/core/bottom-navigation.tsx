import { Heart, LayoutList, Map, QrCode, User } from "lucide-react";

export default function BottomNavigation() {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 bg-white shadow-[4px_4px_0px_#000] h-full">
      <div className="grid grid-cols-5 text-center text-sm h-full">
        <button className="flex flex-col items-center justify-center py-3 hover:bg-yellow-300 transition-all font-semibold">
          <Map className="w-6 h-6" />
          {/* <span className="text-xs mt-1">Explore</span> */}
        </button>
        <button className="flex flex-col items-center justify-center py-3 text-black hover:bg-yellow-300 transition-all font-semibold">
          <LayoutList className="w-6 h-6" />
          {/* <span className="text-xs mt-1">Profile</span> */}
        </button>
        <button className="flex flex-col items-center justify-center py-3 hover:bg-yellow-300 transition-all font-semibold">
          <QrCode className="w-6 h-6" />
          {/* <span className="text-xs mt-1">Scan</span> */}
        </button>
        <button className="flex flex-col items-center justify-center py-3 text-black hover:bg-yellow-300 transition-all font-semibold">
          <Heart className="w-6 h-6" />
          {/* <span className="text-xs mt-1">Profile</span> */}
        </button>
        <button className="flex flex-col items-center justify-center py-3 text-black hover:bg-yellow-300 transition-all font-semibold">
          <User className="w-6 h-6" />
          {/* <span className="text-xs mt-1">Profile</span> */}
        </button>
      </div>
    </div>
  );
}
