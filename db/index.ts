import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { account } from "./schema/account";
import { avatar } from "./schema/avatar";
import { favourite } from "./schema/favourite";
import { place } from "./schema/place";
import { session } from "./schema/session";
import { user } from "./schema/user";
import { verification } from "./schema/verification";
// import { config } from "dotenv";

// config({ path: ".env" }); // or .env.local

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
export const db = drizzle({
  client: sql,
  schema: {
    account,
    avatar,
    favourite,
    place,
    session,
    user,
    verification,
  },
});
