"use client";

import { useEffect, useRef, useState } from "react";
import { distance } from "@turf/distance";
import TabsSafeZone from "@/components/core/tabs-safe-zone";
import { PlaceType } from "@/types/place";
import { FavouriteType } from "@/types/favourite";
import FavCard from "../explore/_components/fav-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from '@/components/ui/card'

export default function FavoriteScreen({
  places,
  favourites,
}: {
  places: PlaceType[];
  favourites: FavouriteType[];
}) {
  const [selectedPlace, setSelectedPlace] = useState<PlaceType | null>(null);
  const placeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get only favorite places
  const favoritePlaces = places.filter(place => 
    favourites.some(fav => fav.placeId === place.id)
  );

  useEffect(() => {
    // Set initial selected place
    if (favoritePlaces.length > 0) {
      setSelectedPlace(favoritePlaces[0]);
    }
    
    setIsLoading(false);
  }, [favoritePlaces]);

  useEffect(() => {
    // Get user location for distance calculation
    navigator.geolocation.getCurrentPosition((geo) => {
      setUserLocation({
        lat: geo.coords.latitude,
        lng: geo.coords.longitude,
      });
    });
  }, []);

  return (
    <TabsSafeZone> 
      <div className="bg-white z-10 pt-[calc(16px+env(safe-area-inset-top))] pb-4 shadow-sm ">
        <h1 className="text-xl font-bold text-center">My Favorites</h1>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm font-medium">Loading favorites...</p>
          </div>
        </div>
      ) : (
        <div className="pt-[calc(64px+env(safe-area-inset-top))] pb-[calc(20px+env(safe-area-inset-bottom))]">
          {favoritePlaces.length > 0 ? (
            <div className="px-4 py-2 space-y-4">
              {favoritePlaces.map((place, index) => (
                <div 
                  key={index} 
                  className="w-full"
                >
                  <FavCard
                    {...{
                      index,
                      mapRef: { current: null }, 
                      place,
                      placeDistance: userLocation
                        ? distance(
                            [userLocation.lng, userLocation.lat],
                            [place.lng, place.lat],
                            { units: "kilometers" }
                          )
                        : null,
                      placeRefs,
                      selectedPlace,
                      setSelectedPlace,
                      setShowCard: () => {}, 
                      favourite: favourites.find(
                        (favourite) => favourite.placeId === place.id
                      ),
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[70vh]">
            <Card className="w-full max-w-sm mx-4">
              <CardContent className="text-center px-4 py-8">
                <div className="flex justify-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/icons/empty-heart.png" 
                    alt="No favorites" 
                    className="w-16 h-16 opacity-60"
                  />
                </div>
                <p className="text-lg font-semibold">No favorites yet</p>
                <p className="text-gray-500 mt-2 mb-4">
                  Add places to your favorites while exploring to see them here
                </p>
                <Link href={`/explore`}>
                  <Button>
                    Start exploring
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>  
          )}
        </div>
      )}
    </TabsSafeZone>
  );
}