import { auth } from "@/lib/auth";
import ProfileScreen from "./profile-screen";
import { headers } from "next/headers";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  return <ProfileScreen name={session.user.name} />;
}
