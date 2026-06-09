CREATE TABLE `glasses_frames` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`style` varchar(100) NOT NULL,
	`color` varchar(100) NOT NULL,
	`lensTint` varchar(100) NOT NULL,
	`genderTag` varchar(50),
	`ageTag` varchar(50),
	`imageUrl` text NOT NULL,
	`imageWidth` int NOT NULL,
	`imageHeight` int NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `glasses_frames_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `try_on_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`uploadedImageUrl` text NOT NULL,
	`resultImageUrl` text,
	`selectedFrameId` int,
	`rotation` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `try_on_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`frameId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_favorites_id` PRIMARY KEY(`id`)
);
