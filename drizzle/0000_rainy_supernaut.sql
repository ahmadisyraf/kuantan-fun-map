CREATE TABLE "places" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "places_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"photos" jsonb[] NOT NULL,
	"category" varchar(100) NOT NULL,
	"opening_hours" jsonb[] NOT NULL,
	CONSTRAINT "places_name_unique" UNIQUE("name")
);
