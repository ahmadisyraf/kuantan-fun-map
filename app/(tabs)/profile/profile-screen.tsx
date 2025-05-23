"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Smile, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar, { genConfig } from "react-nice-avatar";

export default function ProfileScreen({ name }: { name: string }) {
  const router = useRouter();
  const config = genConfig(name);

  return (
    <div className="space-y-10 py-[calc(40px+env(safe-area-inset-top))] px-5">
      <div className="space-y-2">
        <Avatar
          style={{ width: 60, height: 60 }}
          {...config}
          className="border-[1.9px] border-black"
        />
        <h1 className="text-xl font-semibold truncate">{name}</h1>
      </div>
      <div className="space-y-2 relative">
        <p className="text-lg font-medium">Account</p>
        <div>
          <Link href={"/customize-avatar"}>
            <div className="flex flex-row items-center gap-2 py-3">
              <Smile size={18} />
              <span className="text-sm font-medium">Customize avatar</span>
            </div>
          </Link>
          <Separator className="w-full" />
          <div className="flex flex-row items-center gap-2 py-3">
            <User2 size={18} />
            <span className="text-sm font-medium">
              Edit account information
            </span>
          </div>
        </div>
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
