"use client";

import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group";
import { categories } from "@/constants/categories";
import { CategoryType } from "@/types/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export default function CategoryTab() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category") as CategoryType;
  const [activeCategory, setActiveCategory] = useState<CategoryType>(
    categoryParam ?? categories[0]
  );

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
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
    <ButtonGroup
      value={activeCategory}
      onValueChange={(value) => {
        setActiveCategory(value as CategoryType);
        router.push(pathname + "?" + createQueryString("category", value));
      }}
    >
      {categories.map((category) => (
        <ButtonGroupItem className="py-2" value={category} key={category}>
          {category}
        </ButtonGroupItem>
      ))}
    </ButtonGroup>
  );
}
