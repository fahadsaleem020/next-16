CREATE TABLE "authentication" (
	"id" varchar PRIMARY KEY NOT NULL,
	"provider" varchar NOT NULL,
	"client_id" varchar(150) NOT NULL,
	"client_secret" varchar(150) NOT NULL
);
