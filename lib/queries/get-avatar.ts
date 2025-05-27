import { db } from "@/db";
import { avatar as avatarTable } from "@/db/schema/avatar";
import { eq } from "drizzle-orm";

async function getAvatar(avatarId: number) {
  const avatar = await db
    .select()
    .from(avatarTable)
    .where(eq(avatarTable.id, avatarId));

  return avatar[0];
}

export { getAvatar };
