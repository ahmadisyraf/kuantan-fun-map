import { integer, pgTable, timestamp, text } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { place } from "./place";

export const favourite = pgTable("favourite", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  placeId: integer("place_id").notNull(),
  userId: text("user_id").notNull(),
});

export const favouriteToUserRelationship = relations(favourite, ({ one }) => ({
  user: one(user, {
    fields: [favourite.userId],
    references: [user.id],
  }),
}));

export const favouriteToPlaceRelationship = relations(favourite, ({ one }) => ({
  place: one(place, {
    fields: [favourite.placeId],
    references: [place.id],
  }),
}));
