"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import maplibregl, {
  Map,
  MapMouseEvent,
  GeoJSONSource,
  Marker,
} from "maplibre-gl";
import { getMarkerIcon } from "@/utils/get-marker-icon";
import { CategoryType } from "@/types/category";
import { PlaceType } from "@/types/place";
import { categories } from "@/constants/categories";
import { distance } from "@turf/distance";
import GeolocationButton from "./_components/geolocation-button";
import ShowCardButton from "./_components/show-card-button";
import PlaceCard from "./_components/place-card";
import CategoryTab from "./_components/category-tab";
import { useSearchParams } from "next/navigation";

export default function MapScreen({ places }: { places: PlaceType[] }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const clusterMarkers = useRef<Marker[]>([]);
  const [showCard, setShowCard] = useState<boolean>(true);
  const [selectedPlace, setSelectedPlace] = useState<PlaceType | null>(null);
  const placeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>();

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as CategoryType;

  const renderClusterMarkers = (map: Map) => {
    clusterMarkers.current.forEach((marker) => marker.remove());
    clusterMarkers.current = [];

    const source = map.getSource("places") as GeoJSONSource;
    if (!source || !map.isSourceLoaded("places")) return;

    const features = map.querySourceFeatures("places", {
      filter: ["has", "point_count"],
    });

    features.forEach((feature) => {
      const { point_count } = feature.properties!;
      const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number,
      ];

      const container = document.createElement("div");

      createRoot(container).render(
        <div className="relative w-10 h-10 hover:scale-110">
          {/* Badge */}
          <div className="absolute -top-1 -right-1 z-10 bg-white text-black text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full border border-black shadow-sm">
            {point_count}
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/more.png"
            alt="cluster icon"
            className="w-full h-full object-contain"
          />
        </div>
      );

      const marker = new maplibregl.Marker({ element: container })
        .setLngLat([lng, lat])
        .addTo(map);

      clusterMarkers.current.push(marker);
    });
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      center: [103.3256, 3.818],
      zoom: 12,
      minZoom: 12,
      attributionControl: false,
    });

    const map = mapRef.current;

    map.on("load", async () => {
      await Promise.all(
        categories.map(async (category: CategoryType) => {
          const url = getMarkerIcon(category);
          const response = await fetch(url);
          const blob = await response.blob();
          const imageBitmap = await createImageBitmap(blob);

          if (!map.hasImage(category)) {
            map.addImage(category, imageBitmap);
          }
        })
      );

      map.addSource("places", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: places.map((place) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [place.lng, place.lat],
            },
            properties: {
              name: place.name,
              category: place.category,
            },
          })),
        },
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 15,
      });

      map.addLayer({
        id: "unclustered-point",
        type: "symbol",
        source: "places",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "icon-image": ["get", "category"],
          "icon-size": 0.1,
        },
      });

      map.on(
        "click",
        "unclustered-point",
        (e: MapMouseEvent & { features?: GeoJSON.Feature[] }) => {
          const feature = e.features?.[0];
          if (!feature || !feature.properties) return;

          const coords = (feature.geometry as GeoJSON.Point).coordinates as [
            number,
            number,
          ];
          const name = feature.properties.name;

          const matchedPlace = places.find((p) => p.name === name);

          if (matchedPlace) {
            setSelectedPlace(matchedPlace);
            setShowCard(true);

            const index = places.findIndex((p) => p.name === name);

            const cardElement = placeRefs.current[index];

            if (cardElement) {
              cardElement.scrollIntoView({
                behavior: "instant",
                inline: "center",
                block: "nearest",
              });
            }

            map.jumpTo({
              zoom: 18,
              center: coords,
            });
          }
        }
      );

      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("data", (e) => {
        if (
          "sourceId" in e &&
          "isSourceLoaded" in e &&
          e.sourceId === "places" &&
          e.isSourceLoaded
        ) {
          renderClusterMarkers(map);
        }
      });

      map.on("moveend", () => {
        renderClusterMarkers(map);
      });

      map.on("zoomend", () => {
        renderClusterMarkers(map);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
            const index = Number(entry.target.getAttribute("data-index"));
            const place = places[index];
            if (place) {
              setSelectedPlace((prev) =>
                prev?.name === place.name ? prev : place
              );

              map.jumpTo({
                zoom: 18,
                center: [place.lng, place.lat],
              });
            }
            break;
          }
        }
      },
      {
        threshold: 0.9,
        root: document.querySelector(".scroll-container"),
      }
    );

    const elements = Object.entries(placeRefs.current);
    for (const [index, el] of elements) {
      if (el) {
        el.setAttribute("data-index", index);
        observer.observe(el);
      }
    }

    return () => {
      clusterMarkers.current.forEach((marker) => marker.remove());
      observer.disconnect();
      map.remove();
    };
  }, [places]);

  useEffect(() => {
    setSelectedPlace(places[0]);
    placeRefs.current[0]?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "start",
    });
  }, [categoryParam]);

  return (
    <div className="w-full h-[90dvh] relative">
      <div className="absolute w-full top-10 px-5 z-10 overflow-x-auto no-scrollbar">
        <CategoryTab />
      </div>
      <div
        className={`absolute pointer-events-none bottom-5 left-0 right-0 z-10 transition-transform duration-500 ${
          showCard ? "translate-y-0" : " translate-y-2/4"
        }`}
      >
        <div className="flex flex-col space-y-2 relative px-4">
          <GeolocationButton {...{ setUserLocation }} />
          <ShowCardButton {...{ showCard, setShowCard }} />
        </div>

        {/* Place card lists  */}
        <div className="flex gap-4 overflow-x-auto px-4 pb-3 pt-5 no-scrollbar pr-6 pointer-events-auto snap-x snap-mandatory">
          {places.map((place, index) => (
            <div
              className="snap-center snap-always"
              key={index}
              data-index={index}
            >
              <PlaceCard
                {...{
                  index,
                  mapRef,
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
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Render map here */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
