import "server-only";

import { auth } from "../auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { favourite as favouriteTable } from "@/db/schema/favourite";
import { eq } from "drizzle-orm";
import { place as placeTable } from "@/db/schema/place";

async function getUserFavourites() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const favourites = unstable_cache(
    async () => {
      return db
        .select({
          favourite: favouriteTable,
          place: placeTable,
        })
        .from(favouriteTable)
        .innerJoin(placeTable, eq(favouriteTable.placeId, placeTable.id))
        .where(eq(favouriteTable.userId, session.user.id));
    },
    [`favourite:${session.user.id}`],
    {
      tags: ["favourite"],
    }
  );

  return favourites();
}

export { getUserFavourites };
