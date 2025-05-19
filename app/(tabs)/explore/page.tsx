import { PlaceType } from "@/types/place";
import ExploreScreen from "./explore-screen";
import { CategoryType } from "@/types/category";
import { getPlacesByCategory } from "@/lib/queries/get-places-by-category";
import { getUserFavourites } from "@/lib/queries/get-user-favourites";
import { FavouriteType } from "@/types/favourite";

export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const category = (await searchParams).category as CategoryType | undefined;

  const places = (await getPlacesByCategory(
    category ? category : "Cafe"
  )) as PlaceType[];

  const favourites = (await getUserFavourites()) as FavouriteType[];

  return <ExploreScreen {...{ places, favourites }} />;
}
