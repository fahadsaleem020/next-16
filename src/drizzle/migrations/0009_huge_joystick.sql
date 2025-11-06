CREATE TYPE "public"."article_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "articles" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"content_json" jsonb,
	"slug" text NOT NULL,
	"cover_image_url" text,
	"views" integer DEFAULT 0 NOT NULL,
	"status" "article_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "articles_to_tags" (
	"id" varchar PRIMARY KEY NOT NULL,
	"article_id" varchar(128) NOT NULL,
	"tag_id" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"article_id" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" varchar PRIMARY KEY NOT NULL,
	"body" text NOT NULL,
	"user_id" text NOT NULL,
	"article_id" text NOT NULL,
	"parent_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "articles_to_tags" ADD CONSTRAINT "articles_to_tags_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles_to_tags" ADD CONSTRAINT "articles_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_article_id_user_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;