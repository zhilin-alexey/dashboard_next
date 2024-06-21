DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('IN WORK', 'REJECTED', 'DEAL_CLOSED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_number" numeric NOT NULL,
	"last_name" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"middle_name" varchar NOT NULL,
	"birthday_date" date,
	"inn" numeric(12),
	"accountable_full_name" varchar,
	"status" "status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar NOT NULL,
	"login" varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "users_full_name_unique" UNIQUE("full_name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clients" ADD CONSTRAINT "clients_accountable_full_name_users_full_name_fk" FOREIGN KEY ("accountable_full_name") REFERENCES "public"."users"("full_name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
