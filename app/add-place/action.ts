"use server";

import slugify from "slugify";
import { db } from "@/db";
import { placesTable } from "@/db/schema/places";
import { PlaceType } from "@/types/place";
import { revalidateTag } from "next/cache";

export async function addPlace({
  name,
  address,
  category,
  lat,
  lng,
  photos,
  openingHours,
  url
}: PlaceType) {
  await db.insert(placesTable).values({
    name,
    address,
    lat,
    lng,
    photos,
    category,
    openingHours,
    slug: slugify(name, { lower: true, remove: /[@]/g }),
    url,
  });

  revalidateTag("places");
}
