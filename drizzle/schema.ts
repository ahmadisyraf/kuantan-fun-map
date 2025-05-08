import { pgTable, unique, integer, varchar, doublePrecision, jsonb, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const place = pgTable("place", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "places_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	address: varchar({ length: 255 }).notNull(),
	lat: doublePrecision().notNull(),
	lng: doublePrecision().notNull(),
	photos: jsonb().array().notNull(),
	category: varchar({ length: 100 }).notNull(),
	openingHours: jsonb("opening_hours").array().notNull(),
	slug: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	url: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("places_name_unique").on(table.name),
]);
