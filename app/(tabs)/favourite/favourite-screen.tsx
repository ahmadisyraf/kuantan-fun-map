import { FavouriteType } from "@/types/favourite";
import PlaceCard from "./_components/place-card";
import { PlaceType } from "@/types/place";

interface FavouriteScreenProps {
  favourites: {
    favourite: FavouriteType;
    place: PlaceType;
  }[];
}

export default function FavouriteScreen({ favourites }: FavouriteScreenProps) {
  return (
    <div className="px-5 pt-[env(safe-area-inset-top)]">
      <div className="p-5 flex items-center justify-center gap-5">
        <h1 className="text-base font-medium">Favourite</h1>
      </div>
      <div className="py-5 space-y-5 overflow-y-auto no-scrollbar">
        {favourites.map((d, index) => (
          <PlaceCard
            {...{ favourite: d.favourite, place: d.place }}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
