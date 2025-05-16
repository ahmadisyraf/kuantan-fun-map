import { Button } from "@/components/ui/button";
import { CategoryType } from "@/types/category";
import { SlidersHorizontal } from "lucide-react";

interface ShowFilterButtonProps {
  showFilter: boolean;
  setShowFilter: (showFilter: boolean) => void;
  selectedCategory: CategoryType | null;
}

export default function ShowFilterButton({
  showFilter,
  setShowFilter,
  selectedCategory,
}: ShowFilterButtonProps) {
  return (
    <div className="relative">
      <div
        className={`absolute -top-1 -right-1 w-5 h-5 text-xs bg-black border-[1.9px] border-black text-white rounded-full text-center flex flex-row items-center justify-center font-semibold z-10 ${
          selectedCategory ? "visible" : "hidden"
        }`}
      >
        <p>1</p>
      </div>
      <Button
        onClick={() => setShowFilter(!showFilter)}
        className="rounded-full h-[37px] pointer-events-auto flex flex-row items-center gap-1"
      >
        <SlidersHorizontal size={17} />
        {showFilter ? "Hide filter" : "Show filter"}
      </Button>
    </div>
  );
}
