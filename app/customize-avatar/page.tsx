import { auth } from "@/lib/auth";
import CustomizeAvatarScreen from "./customize-avatar-screen";
import { headers } from "next/headers";
import { getUserAvatar } from "@/lib/queries/get-user-avatar";
import { AvatarFullConfig } from "react-nice-avatar";

export default async function CustomizeAvatar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unathorized");

  const avatar = (await getUserAvatar(session.user.avatarId)) as AvatarFullConfig;

  return (
    <CustomizeAvatarScreen {...{ avatar, avatarId: session.user.avatarId }} />
  );
}
