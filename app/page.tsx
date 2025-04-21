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
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group";
import { motion, AnimatePresence } from "motion/react";
import { IconButton } from "@/components/ui/icon-button";

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
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [closingCardId, setClosingCardId] = useState<string | null>(null);
  const [expandedCardInfo, setExpandedCardInfo] = useState<Place | null>(null);

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
      {/* Fun map logo top left */}
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
        {/* Category filter buttons */}
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
              <ButtonGroupItem value={category} key={index}>
                {category}
              </ButtonGroupItem>
            ))}
          </ButtonGroup>
        </div>

        <div className="flex flex-row items-center gap-2 px-4 mb-3 pointer-events-auto">
          {/* Show and hide card button */}
          <IconButton onClick={() => setShowCard(!showCard)}>
            {showCard ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </IconButton>

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

          {/* Clear filter button */}
          <Button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full ${
              selectedCategory ? "visible" : "hidden"
            }`}
          >
            Clear filter
          </Button>
        </div>

        {/* Place card lists  */}
        <div className="flex gap-4 overflow-x-auto px-4 pb-5 pt-5 no-scrollbar pr-6 pointer-events-auto">
          {filterPlacesByCategory(selectedCategory).map((place, index) => (
            <motion.div
              key={place.name}
              className={`min-w-[250px] flex-shrink-0 ${
                expandedCardId === place.name || closingCardId === place.name
                  ? "z-30"
                  : ""
              }`}
              layoutId={`card-container-${place.name}`}
            >
              <Card
                ref={(el) => {
                  placeRefs.current[index] = el;
                }}
                className={`h-full ${
                  selectedPlace?.name === place.name
                    ? "scale-[1.05] z-20 -translate-y-2 shadow-[0_6px_0_rgba(0,0,0,1)]"
                    : "hover:scale-[1.05] z-10"
                }`}
                onClick={() => {
                  setSelectedPlace(place);
                  placeRefs.current[index]?.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                  });

                  const map = mapRef.current;
                  if (map) {
                    map.flyTo({
                      center: place.coordinates,
                      zoom: 18,
                      speed: 1.2,
                      curve: 1.4,
                    });
                  }
                }}
              >
                <div className="w-3 h-3 border-[1.9px] border-black bg-brand absolute top-3 right-3 rounded-full" />
                <CardHeader>
                  <motion.div layoutId={`card-title-${place.name}`}>
                    <CardTitle>{place.name}</CardTitle>
                  </motion.div>
                  <motion.div layoutId={`card-description-${place.name}`}>
                    <CardDescription>{place.category}</CardDescription>
                  </motion.div>
                </CardHeader>
                <CardFooter>
                  <motion.div layoutId={`card-button-${place.name}`}>
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCardId(place.name);
                        setExpandedCardInfo(place);
                      }}
                    >
                      View details
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/*  Expanded selected card */}
      <AnimatePresence>
        {expandedCardId && expandedCardInfo && (
          <motion.div
            key={expandedCardId}
            layoutId={`card-container-${expandedCardId}`}
            className="fixed inset-0 z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="w-full h-full">
              <IconButton
                onClick={() => {
                  setClosingCardId(expandedCardId);
                  setExpandedCardId(null);
                  setExpandedCardInfo(null);

                  setTimeout(() => {
                    setClosingCardId(null);
                  }, 400);
                }}
                className=" absolute top-5 right-5"
              >
                <X size={18} />
              </IconButton>
              <CardHeader>
                <motion.div layoutId={`card-title-${expandedCardId}`}>
                  <CardTitle className="text-lg">
                    {expandedCardInfo.name}
                  </CardTitle>
                </motion.div>
                <motion.div layoutId={`card-description-${expandedCardId}`}>
                  <CardDescription className="text-sm">{expandedCardInfo.category}</CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="flex-1"></CardContent>

              <CardFooter>
                <motion.div layoutId={`card-button-${expandedCardId}`}>
                  <Button className="w-full">Open in Google maps</Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render map here */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
