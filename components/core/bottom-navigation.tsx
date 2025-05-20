"use client";

import { CircleUser, Heart, LayoutList, Map, QrCode } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Map, label: "Explore", value: "/explore" },
  { icon: LayoutList, label: "Itenaries", value: "#" },
  { icon: QrCode, label: "Scan", value: "/qr-code" },
  { icon: Heart, label: "Favorites", value: "#" },
  { icon: CircleUser, label: "Profile", value: "/profile" },
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
                className={`flex flex-col items-center justify-center w-full py-2 transition-all font-semibold h-full gap-1`}
                aria-label={label}
              >
                <Icon
                  className="w-6 h-6"
                  {...(pathname === value && { fill: "#ffde59" })}
                />
                <span className="text-xs font-medium">{label}</span>
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
