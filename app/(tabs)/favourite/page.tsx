
import FavoriteScreen from "./favourite-screen";
import { getUserFavourites } from "@/lib/queries/get-user-favourites";
import { getFavoritePlaces } from "@/lib/queries/get-favourite-places";
import { FavouriteType } from "@/types/favourite";
import { PlaceType } from "@/types/place";
import { CategoryType } from "@/types/category";

export default async function FavoritePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  
  const category = (await searchParams).category as CategoryType | undefined;
  
  const places = await getFavoritePlaces();

  const favourites = (await getUserFavourites()) as FavouriteType[];

  return (
    <FavoriteScreen 
     {...{ places: places as PlaceType[], favourites }}
    />
  );
}