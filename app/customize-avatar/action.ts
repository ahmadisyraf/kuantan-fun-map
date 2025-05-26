"use server";

import { db } from "@/db";
import { AvatarFullConfig } from "react-nice-avatar";
import { avatar as avatarTable } from "@/db/schema/avatar";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

async function saveAvatar(avatarId: number, avatar: AvatarFullConfig | null) {
  if (!avatar) throw new Error("Something went wrong");

  await db.update(avatarTable).set(avatar).where(eq(avatarTable.id, avatarId));

  revalidateTag("user");
}

export { saveAvatar };
