CREATE TABLE `model_folders` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`name` text NOT NULL,
	`version` integer NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `model_assets` ADD `folder_id` text REFERENCES model_folders(id);--> statement-breakpoint
ALTER TABLE `model_assets` ADD `deleted_at` text;