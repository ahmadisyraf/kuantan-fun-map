import { db } from "@/db";
import { place } from "@/db/schema/place";
import { CategoryType } from "@/types/category";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

async function getPlacesByCategory(category: CategoryType) {
  const places = unstable_cache(
    async () => {
      return db.select().from(place).where(eq(place.category, category));
    },
    [`place:${category}`],
    {
      tags: ["place"],
    }
  );

  return places();
}

export { getPlacesByCategory };
