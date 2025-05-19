"use client";

import TabsSafeZone from "@/components/core/tabs-safe-zone";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfileScreen({ name }: { name: string }) {
  const router = useRouter();

  return (
    <TabsSafeZone className="space-y-5 py-[calc(40px+env(safe-area-inset-top))] px-5">
      <div className="">
        <h1 className="text-2xl font-semibold truncate">{name}</h1>
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
    </TabsSafeZone>
  );
}
