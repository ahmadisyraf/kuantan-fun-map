"use server";

import slugify from "slugify";
import { db } from "@/db";
import { place } from "@/db/schema/place";
import { PlaceType } from "@/types/place";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

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
    userId: session.user.id,
  });

  revalidateTag("place");
}
