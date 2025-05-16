import {
  integer,
  pgTable,
  varchar,
  doublePrecision,
  jsonb,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";

export const place = pgTable("place", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  address: varchar({ length: 255 }).notNull(),
  lat: doublePrecision().notNull(),
  lng: doublePrecision().notNull(),
  photos: jsonb("photos").array().notNull(),
  category: varchar({ length: 100 }).notNull(),
  openingHours: jsonb("opening_hours").array().notNull(),
  slug: varchar({ length: 255 }).notNull(),
  url: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: text("user_id"),
});

export const placeToUserRelationship = relations(place, ({ one }) => ({
  user: one(user, {
    fields: [place.userId],
    references: [user.id],
  }),
}));
