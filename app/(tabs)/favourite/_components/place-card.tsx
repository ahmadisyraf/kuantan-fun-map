"use client"

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
import Link from "next/link";
import { addToFavourite, removeFromFavourite } from "../_lib/action";
import { useLoading } from "@/hooks/use-loading";
import { FavouriteType } from "@/types/favourite";

interface PlaceCardProps {
  place: PlaceType;
  favourite: FavouriteType;
}

export default function PlaceCard({ place, favourite }: PlaceCardProps) {
  const { start, stop, loading } = useLoading();
  return (
    <Card className={"h-full shadow-[0_6px_0_rgba(0,0,0,1) w-full"}>
      <div className="w-3 h-3 border-[1.9px] border-black bg-primary absolute top-3 right-3 rounded-full" />
      <CardHeader>
        <CardTitle>{place.name}</CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-1">
          <span>{place.category}</span>
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
