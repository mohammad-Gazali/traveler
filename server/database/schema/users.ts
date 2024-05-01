import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { userTravel } from "./travels";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
});

// relations
export const usersRelations = relations(users, ({ many }) => ({
	travels: many(userTravel, {
		relationName: "",
	}),
}));
