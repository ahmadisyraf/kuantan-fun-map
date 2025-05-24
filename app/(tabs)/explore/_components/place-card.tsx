import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceType } from "@/types/place";
import { Heart, Loader2 } from "lucide-react";
import { Map } from "maplibre-gl";
import Link from "next/link";
import { RefObject } from "react";
import { addToFavourite, removeFromFavourite } from "../_lib/action";
import { FavouriteType } from "@/types/favourite";
import { useLoading } from "@/hooks/use-loading";

interface PlaceCardProps {
  index: number;
  place: PlaceType;
  placeRefs: RefObject<Record<number, HTMLDivElement | null>>;
  selectedPlace: PlaceType | null;
  setSelectedPlace: (place: PlaceType) => void;
  mapRef: RefObject<Map | null>;
  placeDistance: number | null;
  setShowCard: (showCard: boolean) => void;
  favourite: FavouriteType | undefined;
}

export default function PlaceCard({
  index,
  place,
  placeRefs,
  selectedPlace,
  setSelectedPlace,
  mapRef,
  placeDistance,
  setShowCard,
  favourite,
}: PlaceCardProps) {
  const { start, stop, loading } = useLoading();
  return (
    <Card
      ref={(el) => {
        if (el && placeRefs.current) {
          placeRefs.current[index] = el;
        }
      }}
      className={`h-full ${
        selectedPlace?.name === place.name
          ? "scale-[1.05] z-20 -translate-y-2 shadow-[0_6px_0_rgba(0,0,0,1)]"
          : "hover:scale-[1.05] z-10"
      }`}
      onClick={() => {
        setSelectedPlace(place);
        setShowCard(true);
        placeRefs.current?.[index]?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });

        const map = mapRef.current;
        if (map) {
          map.jumpTo({
            center: [place.lng, place.lat],
            zoom: 18,
          });
        }
      }}
    >
      <div className="w-3 h-3 border-[1.9px] border-black bg-primary absolute top-3 right-3 rounded-full" />
      <CardHeader>
        <CardTitle>{place.name}</CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-1">
          <span>{place.category}</span>
          {placeDistance !== null && (
            <>
              <span className="text-muted">•</span>
              <span>{placeDistance.toFixed(2)} km</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardFooter className="grid grid-cols-5 gap-1">
        <Link
          href={`/place/${place.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="col-span-4"
        >
          <Button className="w-full">View details</Button>
        </Link>
        <Button
          className="col-span-1 flex flex-row items-center justify-center p-0"
          disabled={loading}
          onClick={async () => {
            start();
            if (favourite) {
              await removeFromFavourite(favourite.id);
            } else {
              await addToFavourite({ placeId: place.id });
            }

            stop();
          }}
        >
          {loading ? (
            <Loader2 size={17} strokeWidth={2.5} className="animate-spin" />
          ) : (
            <Heart
              size={17}
              strokeWidth={2.5}
              {...(favourite && { fill: "red" })}
            />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
