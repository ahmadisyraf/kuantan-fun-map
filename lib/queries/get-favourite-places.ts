
import { db } from "@/db";
import { place } from "@/db/schema/place";
import { favourite } from "@/db/schema/favourite";
import { eq, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { auth } from "../auth";
import { headers } from "next/headers";

async function getFavoritePlaces() {
  const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    if (!session) throw new Error("Unauthorized");

  const favoritePlaces = unstable_cache(
    async () => {

      const userFavorites = await db
        .select({ placeId: favourite.placeId })
        .from(favourite)
        .where(eq(favourite.userId, session.user.id));

      if (userFavorites.length === 0) {
        return [];
      }

      const placeIds = userFavorites.map(fav => fav.placeId);
      
      return db
        .select()
        .from(place)
        .where(inArray(place.id, placeIds));
    },
    [`favorite-places:${session.user.id}`],
    {
      tags: ["place", "favourite", `user:${session.user.id}`],
    }
  );

  return favoritePlaces();
}

export {getFavoritePlaces};