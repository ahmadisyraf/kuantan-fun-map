import { IconButton } from "@/components/ui/icon-button";
import { authClient } from "@/lib/auth-client";
import { User } from "lucide-react";
import Link from "next/link";

export default function UserButton() {
  const { data: session } = authClient.useSession();
  return (
    <div className="pointer-events-auto">
      {session ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-[37px] w-[37px] rounded-full border-[1.9px] border-black"
          alt="User profile image"
          src={session.user.image || ""}
        />
      ) : (
        <Link href={"/sign-in"}>
          <IconButton>
            <User size={18} />
          </IconButton>
        </Link>
      )}
    </div>
  );
}
