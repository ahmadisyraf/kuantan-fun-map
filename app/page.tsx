"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, {
  Map,
  MapMouseEvent,
  GeoJSONSource,
  Marker,
} from "maplibre-gl";
import { categories, CategoryType, Place, places } from "./data";
import { getMarkerIcon } from "@/lib/get-marker-icon";
import { createRoot } from "react-dom/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group";

export default function Home() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const clusterMarkers = useRef<Marker[]>([]);
  const [showCard, setShowCard] = useState<boolean>(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const placeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const filterPlacesByCategory = (category: CategoryType | null) => {
    if (category) {
      return places.filter((place) => place.category === category);
    }
    return places; // return all places if no category is selected
  };

  const renderClusterMarkers = (map: Map) => {
    // Remove old cluster markers
    clusterMarkers.current.forEach((marker) => marker.remove());
    clusterMarkers.current = []; // Reset clusterMarkers

    const source = map.getSource("places") as GeoJSONSource;
    if (!source || !map.isSourceLoaded("places")) return;

    const features = map.querySourceFeatures("places", {
      filter: ["has", "point_count"],
    });

    features.forEach((feature) => {
      const { point_count } = feature.properties!;
      const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number
      ];

      const container = document.createElement("div");
      createRoot(container).render(
        <div className="relative w-10 h-10 hover:scale-110">
          {/* Badge */}
          <div className="absolute -top-1 -right-1 z-10 bg-white text-black text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full border border-black shadow-sm">
            {point_count}
          </div>

          {/* Icon */}
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
    });

    const map = mapRef.current;

    map.on("load", async () => {
      await Promise.all(
        categories.map(async (category: CategoryType) => {
          const url = getMarkerIcon(category);
          const response = await fetch(url);
          const blob = await response.blob();
          const imageBitmap = await createImageBitmap(blob);

          // Add image if not exist
          if (!map.hasImage(category)) {
            map.addImage(category, imageBitmap);
          }
        })
      );

      map.addSource("places", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: filterPlacesByCategory(selectedCategory).map((place) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: place.coordinates,
            },
            properties: {
              name: place.name,
              category: place.category,
            },
          })),
        },
        cluster: true,
        clusterRadius: 90,
        clusterMaxZoom: 15,
      });

      // Add unclustered point layer
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
            number
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
                behavior: "smooth",
                inline: "center",
                block: "nearest",
              });
            }

            // Fly to point
            map.flyTo({
              center: coords,
              zoom: 18,
              speed: 1.2,
              curve: 1.4,
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

      // Render clusters when data source is ready
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

    return () => {
      clusterMarkers.current.forEach((marker) => marker.remove());
      map.remove();
    };
  }, [selectedCategory]);

  return (
    <div className="relative w-full h-dvh">
      <img
        src="/logo/kuantan-fun-map-2.png"
        className="absolute z-20 w-36 h-36 lg:w-48 lg:h-48 -top-5 lg:-top-12 left-3"
      />

      <div
        className={`absolute pointer-events-none bottom-5 left-0 right-0 z-10 transition-transform duration-500 ${
          showCard
            ? "translate-y-0"
            : showFilter
            ? "translate-y-2/4"
            : "translate-y-3/4"
        }`}
      >
        <div
          className={`flex flex-wrap gap-2 px-4 mb-3 w-full max-w-lg pointer-events-auto ${
            showFilter ? "visible" : "hidden"
          }`}
        >
          <ButtonGroup
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value as CategoryType)
            }
            className="flex flex-wrap"
          >
            {categories.map((category, index) => (
              <ButtonGroupItem value={category} key={index}>{category}</ButtonGroupItem>
            ))}
          </ButtonGroup>
        </div>

        {/* Toggle buttons */}
        <div className="flex flex-row items-center gap-2 px-4 mb-3 pointer-events-auto">
          <button
            onClick={() => setShowCard(!showCard)}
            className="bg-white text-gray-800 shadow-lg border-[1.9px] border-black hover:bg-gray-100 p-2 rounded-full transition-transform active:translate-y-1"
          >
            {showCard ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>

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
              className="rounded-full"
            >
              {showFilter ? "Hide filter" : "Show filter"}
            </Button>
          </div>

          <Button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full ${
              selectedCategory ? "visible" : "hidden"
            }`}
          >
            Clear filter
          </Button>
        </div>

        {/* Card list */}
        <div className="flex gap-4 overflow-x-auto px-4 pb-5 pt-5 no-scrollbar pr-6 pointer-events-auto">
          {filterPlacesByCategory(selectedCategory).map((place, index) => (
            <Card
              key={index}
              ref={(el) => {
                placeRefs.current[index] = el;
              }}
              className={
                selectedPlace && selectedPlace.name === place.name
                  ? "scale-[1.05] z-20 -translate-y-2 shadow-[0_6px_0_rgba(0,0,0,1)]"
                  : "hover:scale-[1.05] z-10"
              }
              onClick={() => {
                setSelectedPlace(place);

                placeRefs.current[index]?.scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "nearest",
                });

                const map = mapRef.current;
                if (!map) return;

                map.flyTo({
                  center: place.coordinates,
                  zoom: 18,
                  speed: 1.2,
                  curve: 1.4,
                });
              }}
            >
              <CardHeader>
                <CardTitle>{place.name}</CardTitle>
                <CardDescription>{place.category}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">View details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
