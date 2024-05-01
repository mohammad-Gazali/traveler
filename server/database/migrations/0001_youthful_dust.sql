CREATE TABLE `service-features` (
	`id` integer PRIMARY KEY NOT NULL,
	`content` text,
	`serviceId` integer,
	FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `travel-service` (
	`travelId` integer,
	`serviceId` integer,
	`price` real NOT NULL,
	PRIMARY KEY(`serviceId`, `travelId`),
	FOREIGN KEY (`travelId`) REFERENCES `travels`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `travels` (
	`id` integer PRIMARY KEY NOT NULL,
	`travelTime` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user-travel` (
	`userId` integer,
	`travelId` integer,
	`serviceId` integer,
	PRIMARY KEY(`serviceId`, `travelId`, `userId`),
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`travelId`) REFERENCES `travels`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_name_unique` ON `services` (`name`);