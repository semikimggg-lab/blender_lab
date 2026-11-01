CREATE TABLE `content_audit` (
	`request_id` text PRIMARY KEY NOT NULL,
	`locale` text NOT NULL,
	`version` integer NOT NULL,
	`content` text NOT NULL,
	`actor_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `library_content` (
	`locale` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`version` integer NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL,
	`request_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_admins` (
	`user_id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`created_at` text NOT NULL
);
