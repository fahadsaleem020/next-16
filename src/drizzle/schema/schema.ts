import { createId } from "@paralleldrive/cuid2";
import { boolean, integer, jsonb, pgEnum, pgTable, type ReferenceConfig, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

// types
type UUIDOptions = Exclude<Parameters<typeof varchar>[1], undefined>;
export type Providers = "Google" | "GitHub" | "Twitter";

// utils
const timeStamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
};

const uuid = (columnName?: string, options?: UUIDOptions) => varchar(columnName ?? "id", options).$defaultFn(() => createId());

const foreignkeyRef = (columnName: string, refColumn: ReferenceConfig["ref"], actions?: ReferenceConfig["actions"]) =>
  varchar(columnName, { length: 128 }).references(refColumn, actions);

// Auth-related tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Blog-related tables
export const articleStatusEnum = pgEnum("article_status", ["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const articles = pgTable("articles", {
  id: uuid().primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  contentJSON: jsonb("content_json"),
  slug: text("slug").notNull().unique(),
  coverImageUrl: text("cover_image_url"),
  views: integer("views").default(0).notNull(),
  status: articleStatusEnum("status").default("DRAFT").notNull(),
  ...timeStamps,
});

export const articlesrelations = relations(articles, ({ many }) => ({
  tags: many(tags),
}));

export const tags = pgTable("tags", {
  id: uuid().primaryKey(),
  name: text("name").notNull(),
  ...timeStamps,
});

export const tagsrelations = relations(tags, ({ many }) => ({
  articles: many(articles),
}));

export const articlesToTags = pgTable("articles_to_tags", {
  id: uuid().primaryKey(),
  articleId: foreignkeyRef("article_id", () => articles.id, { onDelete: "cascade" }).notNull(),
  tagId: foreignkeyRef("tag_id", () => tags.id, { onDelete: "cascade" }).notNull(),
});

export const articlesToTagsRelations = relations(articlesToTags, ({ one }) => ({
  article: one(articles, {
    fields: [articlesToTags.articleId],
    references: [articles.id],
  }),
  tags: one(tags, {
    fields: [articlesToTags.tagId],
    references: [tags.id],
  }),
}));

export const bookmarks = pgTable("bookmarks", {
  id: uuid().primaryKey(),
  userId: foreignkeyRef("user_id", () => user.id, { onDelete: "cascade" }).notNull(),
  articleId: foreignkeyRef("article_id", () => user.id, { onDelete: "set null" }).notNull(),
});

export const comments = pgTable("comments", {
  id: uuid().primaryKey(),
  body: text("body").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  articleId: text("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  parentId: text("parent_id"),
  ...timeStamps,
});

export const authentication = pgTable("authentication", {
  id: uuid().primaryKey(),
  provider: varchar("provider", { enum: ["GitHub", "Google", "Twitter"] })
    .$type<Providers>()
    .unique()
    .notNull(),
  clientId: varchar("client_id", { length: 150 }).notNull(),
  clientSecret: varchar("client_secret", { length: 150 }).notNull(),
  enabled: boolean("enabled").notNull(),
});
