import { db } from "@/db";
import { placesTable } from "@/db/schema/places";
import { unstable_cache } from "next/cache";

const getPlaces = unstable_cache(
  async () => {
    return db.select().from(placesTable);
  },
  ["places"],
  {
    tags: ["places"],
  }
);

export { getPlaces };
