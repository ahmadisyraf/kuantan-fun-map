"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="shadow-[0_6px_0_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle>Sign in to continue</CardTitle>
          <CardDescription>
            One click with Google to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={async () => {
              await authClient.signIn.social({
                /**
                 * The social provider id
                 * @example "github", "google", "apple"
                 */
                provider: "google",
                /**
                 * A URL to redirect after the user authenticates with the provider
                 * @default "/"
                 */
                callbackURL: "/map",
                /**
                 * A URL to redirect if an error occurs during the sign in process
                 */
                errorCallbackURL: "/error",
                /**
                 * A URL to redirect if the user is newly registered
                 */
                newUserCallbackURL: "/map",
              });
            }}
          >
            Sign in with google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
