import { IconButton } from "@/components/ui/icon-button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ShowCardButtonProps {
  setShowCard: (showCard: boolean) => void;
  showCard: boolean;
}

export default function ShowCardButton({
  showCard,
  setShowCard,
}: ShowCardButtonProps) {
  return (
    <IconButton
      onClick={() => setShowCard(!showCard)}
      className="pointer-events-auto mx-4 w-fit"
    >
      {showCard ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
    </IconButton>
  );
}
