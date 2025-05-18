"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  return (
    <div className="h-[calc(100dvh-10dvh-env(safe-area-inset-bottom))] px-5 py-10 space-y-5">
      <div className="">
        <h1 className="text-2xl font-semibold">Edit profile</h1>
        <h3 className="text-base font-medium text-gray-500">
          Manage your profile here
        </h3>
      </div>
      <Button
        className="w-full bg-red-500 text-white"
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/sign-in");
              },
            },
          });
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
