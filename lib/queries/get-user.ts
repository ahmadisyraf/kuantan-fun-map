import { db } from "@/db";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { user as userTable } from "@/db/schema/user";
import { avatar } from "@/db/schema/avatar";
import { auth } from "../auth";
import { headers } from "next/headers";

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const user = await unstable_cache(
    async () => {
      const result = await db
        .select({
          user: userTable,
          avatar: avatar,
        })
        .from(userTable)
        .leftJoin(avatar, eq(userTable.avatarId, avatar.id))
        .where(eq(userTable.id, session.user.id));

      if (result.length === 0) return null;

      const { user, avatar: userAvatar } = result[0];

      return {
        ...user,
        avatar: userAvatar,
      };
    },
    [`user:${session.user.id}`],
    {
      tags: ["user"],
    }
  );

  return user();
}

export { getUser };
