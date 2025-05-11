import { db } from "@/db";
import { place as placeTable } from "@/db/schema/place";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

async function getPlace(slug: string) {
  const place = unstable_cache(
    async () => {
      const [place] = await db
        .select()
        .from(placeTable)
        .where(eq(placeTable.slug, slug));

      return place;
    },
    ["place", `place:${slug}`],
    {
      tags: ["place", `place:${slug}`],
    }
  );

  return place();
}

export { getPlace };
