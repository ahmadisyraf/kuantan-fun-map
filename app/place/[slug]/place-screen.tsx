"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceType } from "@/types/place";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export default function PlaceScreen({ place }: { place: PlaceType }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="w-full flex flex-row items-center justify-center py-10 px-5">
      <Card className="w-full shadow-[0_6px_0_rgba(0,0,0,1)] max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg">{place.name}</CardTitle>
          <CardDescription className="text-sm">{place.address}</CardDescription>
        </CardHeader>
        <CardContent className="py-5">
          {/* Image carousell */}
          <div className="border-[1.9px] border-black rounded-lg overflow-hidden">
            <Carousel setApi={setApi} className="relative">
              <CarouselContent>
                {place.photos.map((photo) => (
                  <CarouselItem key={photo}>
                    <img
                      src={photo}
                      className="w-full aspect-square lg:aspect-video object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Slide Count */}
              <div className="absolute top-5 right-5 text-sm text-muted-foreground border-[1.9px] border-black rounded-lg bg-brand px-3 py-1">
                Slide {current} of {count}
              </div>

              <CarouselPrevious className="hidden lg:inline" />
              <CarouselNext className="hidden lg:inline" />
            </Carousel>
          </div>

          {/* Operating hour */}
          {place.openingHours.length > 0 && (
            <div className="mt-5">
              <div className="border-[1.9px] border-black rounded-lg bg-muted p-4">
                <h4 className="font-semibold text-base mb-2 text-black">
                  Business Hours
                </h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {place.openingHours.map((entry, index) => {
                    const [day, ...timeParts] = entry.split(":");
                    const time = timeParts.join(":").trim(); 

                    return (
                      <div
                        key={index}
                        className="flex justify-between border-b last:border-b-0 pb-1"
                      >
                        <span className="text-black">{day}</span>
                        <span
                          className={time === "Closed" ? "text-red-500" : ""}
                        >
                          {time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Open in google map button */}
        <CardFooter>
          <Link href={place.url}>
            <Button className="w-full">Open in google maps</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
