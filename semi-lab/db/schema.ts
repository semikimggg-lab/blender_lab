import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const libraryContent = sqliteTable('library_content', {
  locale: text('locale').primaryKey(),
  content: text('content').notNull(),
  version: integer('version').notNull(),
  updatedAt: text('updated_at').notNull(),
  updatedBy: text('updated_by').notNull(),
  requestId: text('request_id').notNull(),
});
export const siteAdmins = sqliteTable('site_admins', {
  userId: text('user_id').primaryKey(),
  role: text('role').notNull(),
  createdAt: text('created_at').notNull(),
});
export const contentAudit = sqliteTable('content_audit', {
  requestId: text('request_id').primaryKey(),
  locale: text('locale').notNull(),
  version: integer('version').notNull(),
  content: text('content').notNull(),
  actorId: text('actor_id').notNull(),
  createdAt: text('created_at').notNull(),
});
