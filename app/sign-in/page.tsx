"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  return (
    <div className="h-screen flex items-center justify-center px-5">
      <div className="space-y-5 text-center">
        <div className="rounded-lg border-[1.9px] border-black shadow-[0_6px_0_rgba(0,0,0,1)] p-5 relative">
          <div className="space-y-1 text-center">
            <h1 className="text-base font-semibold">
              Welcome to Kuantan Fun Map
            </h1>
            <h3 className="text-sm text-gray-500 font-medium">
              Sign in to continue
            </h3>
          </div>
          <div className="pt-7">
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
          </div>
        </div>
        <p className="text-xs font-medium text-gray-500">Built by Isyraf</p>
      </div>
    </div>
  );
}
