import ProfileScreen from "./profile-screen";
import { getUser } from "@/lib/queries/get-user";
import { UserType } from "@/types/user";
import { AvatarFullConfig } from "react-nice-avatar";

export default async function Profile() {
  const user = (await getUser()) as UserType & {
    avatar: AvatarFullConfig;
  };

  return <ProfileScreen {...{ user }} />;
}
