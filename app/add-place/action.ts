"use server";

import slugify from "slugify";
import { db } from "@/db";
import { place } from "@/db/schema/place";
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
  url,
}: PlaceType) {
  await db.insert(place).values({
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

  revalidateTag("place");
}
