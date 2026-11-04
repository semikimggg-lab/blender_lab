CREATE TABLE `model_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`object_key` text NOT NULL,
	`manifest` text NOT NULL,
	`version` integer NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
