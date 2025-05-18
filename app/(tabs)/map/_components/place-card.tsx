import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceType } from "@/types/place";
import { Map } from "maplibre-gl";
import Link from "next/link";
import { RefObject } from "react";

interface PlaceCardProps {
  index: number;
  place: PlaceType;
  placeRefs: RefObject<Record<number, HTMLDivElement | null>>;
  selectedPlace: PlaceType | null;
  setSelectedPlace: (place: PlaceType) => void;
  mapRef: RefObject<Map | null>;
  placeDistance: number | null;
}

export default function PlaceCard({
  index,
  place,
  placeRefs,
  selectedPlace,
  setSelectedPlace,
  mapRef,
  placeDistance,
}: PlaceCardProps) {
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
            // speed: 1.2,
            // curve: 1.4,
          });
        }
      }}
    >
      <div className="w-3 h-3 border-[1.9px] border-black bg-brand absolute top-3 right-3 rounded-full" />
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
      <CardFooter>
        <Link
          href={`/place/${place.slug}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button className="w-full">View details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
