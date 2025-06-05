"use server";

import { db } from "@/db";
import { favourite } from "@/db/schema/favourite";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

async function addToFavourite({ placeId }: { placeId: number }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await db.insert(favourite).values({
    placeId,
    userId: session.user.id,
  });

  revalidateTag("favourite");
}

async function removeFromFavourite(favouriteId: number) {
  await db.delete(favourite).where(eq(favourite.id, favouriteId));

  revalidateTag("favourite");
}

export { addToFavourite, removeFromFavourite };
