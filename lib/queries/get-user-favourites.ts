import "server-only";
import { auth } from "../auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { favourite } from "@/db/schema/favourite";
import { eq } from "drizzle-orm";

async function getUserFavourites() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const favourites = unstable_cache(
    async () => {
      return db
        .select()
        .from(favourite)
        .where(eq(favourite.userId, session.user.id));
    },
    [`favourite:${session.user.id}`],
    {
      tags: ["favourite"],
    }
  );

  return favourites();
}

export { getUserFavourites };
