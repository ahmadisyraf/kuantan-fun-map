"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { PlaceType } from "@/types/place";
import { addPlace } from "./action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useLoading } from "@/hooks/use-loading";
import { Loader2 } from "lucide-react";
import { toastPromise } from "@/components/ui/toast";
import { z } from "zod";
import { categories } from "@/constants/categories";

interface Suggestion {
  description: string;
  placeId: string;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Place name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  lat: z
    .number()
    .min(-90)
    .max(90, { message: "Latitude must be between -90 and 90" }),
  lng: z
    .number()
    .min(-180)
    .max(180, { message: "Longitude must be between -180 and 180" }),
  photos: z.array(z.string().url(), {
    message: "Each photo must be a valid URL",
  }),
  category: z.enum(categories, { message: "Invalid category" }),
  openingHours: z.array(z.string().min(1), {
    required_error: "Opening hours are required",
    invalid_type_error: "Each opening hour must be a non-empty string",
  }),
  url: z.string().url({ message: "URL must be a valid link" }),
});

export default function PlaceSearch() {
  const [place, setPlace] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  const { start, stop, loading } = useLoading();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_PLACE_API!,
    version: "weekly",
    libraries: ["places"],
  });

  useEffect(() => {
    loader.importLibrary("places").then(() => {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(
        document.createElement("div")
      );
    });
  }, []);

  const handlePlaceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setPlace(input);

    if (!input || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }

    fetchPlaceSuggestions(input);
  };

  const fetchPlaceSuggestions = (input: string) => {
    autocompleteService.current?.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: "my" },
      },
      handlePredictions
    );
  };

  const handlePredictions = (
    predictions: google.maps.places.AutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
      setSuggestions([]);
      return;
    }

    setSuggestions(
      predictions.map((p) => ({
        description: p.description,
        placeId: p.place_id,
      }))
    );
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (!placesService.current) return;

    fetchPlaceDetails(suggestion.placeId, (placeData) => {
      if (!placeData) return;

      const formattedPlace = formatPlaceData(placeData);
      form.setValue("name", formattedPlace.name);
      form.setValue("address", formattedPlace.address);
      form.setValue("lat", formattedPlace.lat);
      form.setValue("lng", formattedPlace.lng);
      form.setValue("photos", formattedPlace.photos);
      form.setValue("openingHours", formattedPlace.openingHours);
      setPlace(suggestion.description);
      form.setValue("url", formattedPlace.url);
      setSuggestions([]);
    });
  };

  const fetchPlaceDetails = (
    placeId: string,
    callback: (place: google.maps.places.PlaceResult | null) => void
  ) => {
    placesService.current?.getDetails(
      {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "geometry",
          "photos",
          "opening_hours",
          "url",
        ],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          callback(place);
        } else {
          callback(null);
        }
      }
    );
  };

  const formatPlaceData = (
    place: google.maps.places.PlaceResult
  ): PlaceType => {
    const photos = place.photos?.map((p) => p.getUrl()) || [];

    return {
      name: place.name || "",
      address: place.formatted_address || "",
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
      photos,
      category: form.getValues("category") ?? "Mall",
      openingHours: place.opening_hours?.weekday_text || [],
      url: place.url || "",
      slug: "",
    };
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const promise = async () => {
      start();

      await addPlace({
        name: data.name,
        address: data.address,
        category: data.category,
        lat: data.lat,
        lng: data.lng,
        photos: data.photos,
        openingHours: data.openingHours,
        url: data.url,
        slug: "",
      });

      form.reset();
      setPlace("");
      stop();
    };

    toastPromise(promise, {
      loading: "Adding your place to our database",
      success: () => "Your place has been added to our database",
      error: "Oops, something wrong! Please try again later",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-background p-4">
      <Card className="w-full max-w-md border-2 border-black scale-[1.05] z-20 -translate-y-2 shadow-[0_6px_0_rgba(0,0,0,1)] rounded-lg bg-white">
        <CardHeader>
          <CardTitle>Add New Location</CardTitle>
          <CardDescription>
            Search and select a new location to add
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={() => (
                  <FormItem className="relative">
                    <Input
                      placeholder="Search place"
                      value={place}
                      onChange={handlePlaceChange}
                      disabled={loading}
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 border-2 border-black rounded-md bg-white shadow-[4px_4px_0px_black] max-h-48 overflow-y-auto z-50">
                        {suggestions.map((s, i) => (
                          <div
                            key={s.placeId}
                            className={cn(
                              "px-4 py-2 text-black cursor-pointer",
                              i === activeIndex
                                ? "bg-amber-300"
                                : "hover:bg-gray-100"
                            )}
                            onClick={() => handleSuggestionClick(s)}
                            onMouseEnter={() => setActiveIndex(i)}
                          >
                            {s.description}
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger disabled={loading}>
                          <SelectValue placeholder="Select place category" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter>
                <Button
                  type="submit"
                  className="border-2 border-black shadow-[2px_2px_0px_black] bg-amber-400 text-black font-bold hover:bg-amber-300 w-full flex flex-row items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex flex-row items-center gap-2">
                      <Loader2 size={15} className="animate-spin" />
                      Loading
                    </span>
                  ) : (
                    "Add"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
