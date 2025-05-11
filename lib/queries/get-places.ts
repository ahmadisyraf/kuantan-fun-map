import { db } from "@/db";
import { place } from "@/db/schema/place";
import { unstable_cache } from "next/cache";

const getPlaces = unstable_cache(
  async () => {
    return db.select().from(place);
  },
  ["places"],
  {
    tags: ["place"],
  }
);

export { getPlaces };
