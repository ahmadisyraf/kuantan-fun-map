import { auth } from "@/lib/auth";
import SignInScreen from "./sign-in-screen";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/explore");

  return <SignInScreen />;
}