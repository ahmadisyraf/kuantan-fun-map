import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { user } from "@/db/schema/user";
import { account } from "@/db/schema/account";
import { session } from "@/db/schema/session";
import { verification } from "@/db/schema/verification";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, account, session, verification },
  }),
  user: {
    additionalFields: {
      avatarId: {
        type: "number",
        required: true,
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },
  plugins: [nextCookies()],
});
