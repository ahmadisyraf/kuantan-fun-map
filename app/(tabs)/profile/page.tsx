import { auth } from "@/lib/auth";
import ProfileScreen from "./profile-screen";
import { headers } from "next/headers";
import { getUser } from "@/lib/queries/get-user";
import { UserType } from "@/types/user";
import { AvatarFullConfig } from "react-nice-avatar";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const user = (await getUser(session.user.id)) as UserType & {
    avatar: AvatarFullConfig;
  };

  return <ProfileScreen {...{ user }} />;
}
