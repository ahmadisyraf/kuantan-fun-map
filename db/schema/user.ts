import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { place } from "./place";
import { favourite } from "./favourite";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userToPlaceRelationship = relations(user, ({ many }) => ({
  place: many(place),
}));

export const userToFavouriteRelationship = relations(user, ({ many }) => ({
  favourite: many(favourite),
}));
