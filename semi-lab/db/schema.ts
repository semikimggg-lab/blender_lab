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

export const modelFolders = sqliteTable('model_folders', {
 id:text('id').primaryKey(),
 parentId:text('parent_id'),
 name:text('name').notNull(),
 version:integer('version').notNull(),
 createdBy:text('created_by').notNull(),
 createdAt:text('created_at').notNull(),
 updatedAt:text('updated_at').notNull(),
});

export const modelAssets = sqliteTable('model_assets', {
 id: text('id').primaryKey(),
 title: text('title').notNull(),
 objectKey: text('object_key').notNull(),
 folderId:text('folder_id').references(()=>modelFolders.id),
 deletedAt:text('deleted_at'),
 manifest: text('manifest').notNull(),
 version: integer('version').notNull(),
 createdBy: text('created_by').notNull(),
 createdAt: text('created_at').notNull(),
 updatedAt: text('updated_at').notNull(),
});
