"use client";

import { Heart, LayoutList, Map, QrCode, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Map, label: "Explore", value: "/explore" },
  { icon: LayoutList, label: "Itenaries", value: "#" },
  { icon: QrCode, label: "Scan QR Code", value: "#" },
  { icon: Heart, label: "Favorites", value: "#" },
  { icon: User, label: "Profile", value: "/profile" },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-50 bg-white h-full">
      <ul className="grid grid-cols-5 text-sm text-center h-full">
        {navItems.map(({ icon: Icon, label, value }, index) => (
          <li key={index}>
            <Link href={value}>
              <button
                className={`flex flex-col items-center justify-center w-full py-3 transition-all font-semibold text-black h-full ${pathname === value && "bg-brand"}`}
                aria-label={label}
              >
                <Icon className="w-6 h-6" />
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
