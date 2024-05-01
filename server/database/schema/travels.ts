import { relations } from "drizzle-orm";
import {
	sqliteTable,
	integer,
	text,
	primaryKey,
	real,
} from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const travels = sqliteTable("travels", {
	id: integer("id").primaryKey(),
	travelTime: text("travelTime").notNull(),
	status: text("status", { enum: ["available", "full", "ended"] }),
});

export const services = sqliteTable("services", {
	id: integer("id").primaryKey(),
	name: text("name").notNull().unique(),
});

export const serviceFeatures = sqliteTable("service-features", {
	id: integer("id").primaryKey(),
	content: text("content"),
	serviceId: integer("serviceId").references(() => services.id),
});

export const travelService = sqliteTable(
	"travel-service",
	{
		travelId: integer("travelId").references(() => travels.id),
		serviceId: integer("serviceId").references(() => services.id),
		price: real("price").notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.travelId, table.serviceId] }),
	})
);

export const userTravel = sqliteTable(
	"user-travel",
	{
		userId: integer("userId").references(() => users.id),
		travelId: integer("travelId").references(() => travels.id),
		serviceId: integer("serviceId").references(() => services.id),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.userId, table.travelId, table.serviceId],
		}),
	})
);

// relations
export const travelsRelations = relations(travels, ({ many }) => ({
	services: many(travelService),
	users: many(userTravel),
}));

export const servicesRelations = relations(services, ({ many }) => ({
	features: many(serviceFeatures),
}));

export const serviceFeaturesRelations = relations(
	serviceFeatures,
	({ one }) => ({
		service: one(services, {
			fields: [serviceFeatures.id],
			references: [services.id],
		}),
	})
);

export const travelServiceRelations = relations(travelService, ({ one }) => ({
	travel: one(travels, {
		fields: [travelService.travelId],
		references: [travels.id],
	}),
	service: one(services, {
		fields: [travelService.serviceId],
		references: [services.id],
	}),
}));

export const userTravelRelation = relations(userTravel, ({ one }) => ({
	user: one(users, {
		fields: [userTravel.userId],
		references: [users.id],
	}),
	travel: one(travels, {
		fields: [userTravel.travelId],
		references: [travels.id],
	}),
	service: one(services, {
		fields: [userTravel.serviceId],
		references: [services.id],
	}),
}));
