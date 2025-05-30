"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLoading } from "@/hooks/use-loading";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toastPromise } from "@/components/ui/toast";
import { z } from "zod";
import { categories } from "@/constants/categories";
import { useRouter } from "next/navigation";
import { CategoryType } from "@/types/category";
import { Checkbox } from "@/components/ui/checkbox";

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

export default function AddPlaceScreen({
  categoryParam,
}: {
  categoryParam: CategoryType | undefined;
}) {
  const [place, setPlace] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [agree, setAgree] = useState<boolean>(false);

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  const router = useRouter();

  const { start, stop, loading } = useLoading();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: categoryParam ?? undefined,
    },
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
      id: 0,
      name: place.name || "",
      address: place.formatted_address || "",
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
      photos,
      category: form.getValues("category") ?? "Mall",
      openingHours: place.opening_hours?.weekday_text || [],
      url: place.url || "",
      slug: "",
      userId: "",
    };
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const promise = async () => {
      start();

      await addPlace({
        id: 0,
        name: data.name,
        address: data.address,
        category: data.category,
        lat: data.lat,
        lng: data.lng,
        photos: data.photos,
        openingHours: data.openingHours,
        url: data.url,
        slug: "",
        userId: "",
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
    <div className="h-dvh pt-[env(safe-area-inset-top)] relative">
      <div className="p-5 flex flex-row items-center gap-5">
        <div onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </div>
        <h1 className="text-base font-medium">Add new location</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-5 h-full py-5 space-y-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={() => (
              <FormItem className="relative">
                <FormLabel className="text-sm font-medium">
                  Enter the name of the place
                </FormLabel>
                <Input
                  placeholder="Example: Kuantan Pickers"
                  value={place}
                  onChange={handlePlaceChange}
                  disabled={loading}
                  className="text-sm"
                />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 border-2 border-black rounded-md bg-white shadow-[4px_4px_0px_black] max-h-48 overflow-y-auto z-50 text-sm">
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
                <FormLabel className="text-sm font-medium">
                  Select a category that best describes the place
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger disabled={loading} className="text-sm">
                      <SelectValue placeholder="Select place category" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-sm">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agree}
              onCheckedChange={(checked) => setAgree(Boolean(checked))}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              By ticking this checkbox, you confirm that all information
              provided is accurate and legitimate.
            </label>
          </div>

          <Button
            type="submit"
            className="border-2 border-black shadow-[2px_2px_0px_black] bg-primary text-black font-bold hover:bg-primary w-full flex flex-row items-center justify-center text-sm"
            disabled={loading || !agree}
          >
            {loading ? (
              <span className="flex flex-row items-center gap-2">
                <Loader2 size={15} className="animate-spin" />
                Loading
              </span>
            ) : (
              "Add this place"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
