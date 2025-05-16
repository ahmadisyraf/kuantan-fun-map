import { PlaceType } from "@/types/place";
import MapScreen from "./map-screen";
import { getPlaces } from "@/lib/queries/get-places";
import { CategoryType } from "@/types/category";
import { getPlacesByCategory } from "@/lib/queries/get-places-by-category";

export default async function Map({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const category = (await searchParams).category as CategoryType | undefined;
  const places = category
    ? ((await getPlacesByCategory(category)) as PlaceType[])
    : ((await getPlaces()) as PlaceType[]);

  return <MapScreen {...{ places }} />;
}
