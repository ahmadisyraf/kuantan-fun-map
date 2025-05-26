import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const avatar = pgTable("avatar", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  sex: varchar({ length: 20 }).notNull().default("man"),
  earSize: varchar({ length: 50 }).notNull().default("small"),
  hairStyle: varchar({ length: 50 }).notNull().default("normal"),
  hatStyle: varchar({ length: 50 }).notNull().default("none"),
  eyeStyle: varchar({ length: 50 }).notNull().default("circle"),
  glassesStyle: varchar({ length: 50 }).notNull().default("none"),
  noseStyle: varchar({ length: 50 }).notNull().default("short"),
  mouthStyle: varchar({ length: 50 }).notNull().default("smile"),
  shirtStyle: varchar({ length: 50 }).notNull().default("hoody"),
  eyeBrowStyle: varchar({ length: 50 }).notNull().default("up"),

  bgColor: varchar({ length: 20 }).notNull().default("#ffffff"),
  hairColor: varchar({ length: 20 }).notNull().default("#000000"),
  shirtColor: varchar({ length: 20 }).notNull().default("#000000"),
  faceColor: varchar({ length: 20 }).notNull().default("#F8C9B6"),
  hatColor: varchar({ length: 20 }).notNull().default("#F8C9B6"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const avatarToUserRelationship = relations(avatar, ({ one }) => ({
  user: one(user),
}));
