import { db } from "@/db";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { user as userTable } from "@/db/schema/user";
import { avatar } from "@/db/schema/avatar";

async function getUser(userId: string) {
  const user = await unstable_cache(
    async () => {
      const result = await db
        .select({
          user: userTable,
          avatar: avatar,
        })
        .from(userTable)
        .leftJoin(avatar, eq(userTable.avatarId, avatar.id))
        .where(eq(userTable.id, userId));

      if (result.length === 0) return null;

      const { user, avatar: userAvatar } = result[0];

      return {
        ...user,
        avatar: userAvatar,
      };
    },
    [`user:${userId}`],
    {
      tags: ["user"],
    }
  );

  return user();
}

export { getUser };
