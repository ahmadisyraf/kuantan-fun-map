import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group";
import { categories } from "@/constants/categories";
import { CategoryType } from "@/types/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface CategoryFilterProps {
  showFilter: boolean;
  selectedCategory: CategoryType;
}

export default function CategoryFilter({
  showFilter,
  selectedCategory,
}: CategoryFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return (
    <div className={showFilter ? "absolute bottom-14" : "hidden"}>
      <div className="flex flex-wrap pointer-events-auto pr-3 w-full max-w-lg">
        <ButtonGroup
          value={selectedCategory}
          onValueChange={(value) => {
            if (value === selectedCategory) {
              router.push(pathname);
            } else {
              router.push(
                pathname + "?" + createQueryString("category", value)
              );
            }
          }}
          className="flex flex-wrap"
        >
          {categories.map((category, index) => (
            <ButtonGroupItem value={category} key={index}>
              {category}
            </ButtonGroupItem>
          ))}
        </ButtonGroup>
      </div>
    </div>
  );
}
