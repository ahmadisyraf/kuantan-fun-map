import { db } from "@/db";
import { placesTable } from "@/db/schema/places";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

async function getPlace(slug: string) {
  const place = unstable_cache(
    async () => {
      const [place] = await db
        .select()
        .from(placesTable)
        .where(eq(placesTable.slug, slug));

      return place;
    },
    [slug],
    {
      tags: ["places"],
    }
  );

  return place();
}

export { getPlace };
