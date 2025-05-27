import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { place } from "./place";
import { favourite } from "./favourite";
import { avatar } from "./avatar";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  avatarId: integer("avatar_id"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userToPlaceRelationship = relations(user, ({ many }) => ({
  place: many(place),
}));

export const userToFavouriteRelationship = relations(user, ({ many }) => ({
  favourite: many(favourite),
}));

export const userToAvatar = relations(user, ({ one }) => ({
  avatar: one(avatar, {
    fields: [user.avatarId],
    references: [avatar.id],
  }),
}));
