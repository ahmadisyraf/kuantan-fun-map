import { getUserFavourites } from "@/lib/queries/get-user-favourites";
import { FavouriteType } from "@/types/favourite";
import { PlaceType } from "@/types/place";
import FavouriteScreen from "./favourite-screen";

export default async function Favourite() {
  const favourites = (await getUserFavourites()) as {
    favourite: FavouriteType;
    place: PlaceType;
  }[];

  return <FavouriteScreen {...{ favourites }} />;
}
