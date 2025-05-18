"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories } from "@/constants/categories";
import { CategoryType } from "@/types/category";
import { getMarkerIcon } from "@/utils/get-marker-icon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export default function CategoryTab() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category") as CategoryType;
  const [activeTab, setActiveTab] = useState<CategoryType>(
    categoryParam ?? categories[0]
  );

  useEffect(() => {
    if (categoryParam) {
      setActiveTab(categoryParam);
    }
  }, [categoryParam]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="w-full overflow-x-auto no-scrollbar border-b-2 border-black">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as CategoryType);
          router.push(pathname + "?" + createQueryString("category", value));
        }}
        className="w-full bg-white"
      >
        <TabsList className="h-auto rounded-none border-b-1 border-black bg-transparent">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="w-20">
              <div className="flex flex-col items-center justify-center text-center space-y-1">
                <img className="h-10 w-10" src={getMarkerIcon(category)} />
                <span className="text-xs font-semibold">{category}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
