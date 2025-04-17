"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, {
  Map,
  MapMouseEvent,
  GeoJSONSource,
  Marker,
} from "maplibre-gl";
import { categories, CategoryType, Place, places } from "./data";
import { getIcons } from "@/lib/get-icons";
import { createRoot } from "react-dom/client";

export default function Home() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const clusterMarkers = useRef<Marker[]>([]);
  // const [placesInBbox, setPlacesInBbox] = useState<Place[]>([]);
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

  // Commenting out the `getPointsInBbox` function for now
  // function getPointsInBbox(map: Map, places: Place[]): Place[] {
  //   const bounds = map.getBounds(); // Get the current map bounds

  //   // Filter places based on whether their coordinates are within the bounds
  //   return places.filter((place) => {
  //     const [lng, lat] = place.coordinates;

  //     // Check if the place's coordinates fall within the current map bounds
  //     return (
  //       lng >= bounds.getWest() &&
  //       lng <= bounds.getEast() &&
  //       lat >= bounds.getSouth() &&
  //       lat <= bounds.getNorth()
  //     );
  //   });
  // }

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
      categories.map(async (category: CategoryType) => {
        const url = getIcons(category);
        const response = await fetch(url);
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);

        // Add image if not exist
        if (!map.hasImage(category)) {
          map.addImage(category, imageBitmap);
        }
      });

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
              address: place.address,
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

            const cardEl = placeRefs.current[index];
            if (cardEl) {
              cardEl.scrollIntoView({
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
          // Commented out the getPointsInBbox function call for now
          // setPlacesInBbox(getPointsInBbox(map, placesToRender));
        }
      });

      map.on("moveend", () => {
        renderClusterMarkers(map);
        // Commented out the getPointsInBbox function call for now
        // setPlacesInBbox(getPointsInBbox(map, placesToRender));
      });

      map.on("zoomend", () => {
        renderClusterMarkers(map);
        // Commented out the getPointsInBbox function call for now
        // setPlacesInBbox(getPointsInBbox(map, placesToRender));
      });
    });

    return () => {
      clusterMarkers.current.forEach((marker) => marker.remove());
      map.remove();
    };
  }, [selectedCategory]);

  return (
    <div className="relative w-full h-dvh">
      <div
        className={`absolute bottom-5 left-0 right-0 z-10 transition-transform duration-500 ${
          showCard
            ? "translate-y-0"
            : showFilter
            ? "translate-y-2/4"
            : "translate-y-3/4"
        }`}
      >
        {/* Category Buttons Row (only when filter is on) */}
        {showFilter && (
          <div className="flex flex-wrap gap-2 px-4 mb-3 w-full max-w-lg">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all transform duration-200 font-semibold ${
                  selectedCategory === category
                    ? "bg-brand text-black border-[1.9px] border-black"
                    : "bg-black text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Toggle buttons */}
        <div className="flex flex-row items-center gap-2 px-4 mb-3">
          <button
            onClick={() => setShowCard(!showCard)}
            className="bg-white text-gray-800 shadow-lg border-[1.9px] border-black hover:bg-gray-100 p-2 rounded-full transition-transform active:translate-y-1"
          >
            {showCard ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
          </button>

          <div className="relative">
            {selectedCategory && (
              <div className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-black border-[1.9px] border-black text-white rounded-full text-center flex flex-row items-center justify-center font-semibold">
                <p>1</p>
              </div>
            )}
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="text-xs font-bold bg-brand text-black border-[1.9px] border-black px-3 py-2 rounded-full transition-transform active:translate-y-1"
            >
              {showFilter ? "HIDE FILTER" : "SHOW FILTER"}
            </button>
          </div>
        </div>

        {/* Card list */}
        <div className="flex gap-4 overflow-x-auto px-4 pb-5 pt-5 no-scrollbar pr-6">
          {filterPlacesByCategory(selectedCategory).map((place, index) => (
            <div
              key={index}
              ref={(el) => {
                placeRefs.current[index] = el;
              }}
              className={`bg-white border-black border-[1.9px] rounded-xl px-5 py-4 w-[280px] h-[160px] shrink-0 transition-transform duration-300 cursor-pointer relative
          ${
            selectedPlace && selectedPlace.name === place.name
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
                if (!map) return;

                map.flyTo({
                  center: place.coordinates,
                  zoom: 18,
                  speed: 1.2,
                  curve: 1.4,
                });
              }}
            >
              <h3 className="text-base font-bold text-black">{place.name}</h3>
              <span className="inline-block text-xs font-semibold text-gray-600 mt-1">
                {place.category}
              </span>
              <div className="mt-4">
                <button className="text-xs font-bold bg-brand text-black border-[1.9px] border-black px-3 py-2 rounded w-full transition-transform active:translate-y-1">
                  VIEW DETAILS
                </button>
              </div>

              <div className="absolute top-2 right-2 w-3 h-3 bg-brand border-[1.9px] border-black rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* <div className="absolute top-0 left-0 z-10 m-4 p-2 bg-white shadow-lg rounded-xl flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-300 ${
              selectedCategory === category
                ? "bg-amber-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-amber-600 hover:text-white"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div> */}

      <img
        src="/logo/kuantan-fun-map-2.png"
        className="absolute z-20 w-52 h-52 -top-12 left-3"
      />

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
