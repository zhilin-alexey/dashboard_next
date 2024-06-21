import {
  date,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const statusEnum = pgEnum("status", [
  "IN WORK",
  "REJECTED",
  "DEAL_CLOSED",
]);

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountNumber: numeric("account_number").notNull(),
  lastName: varchar("last_name").notNull(),
  fistName: varchar("first_name").notNull(),
  middleName: varchar("middle_name").notNull(),
  birthdayDate: date("birthday_date"),
  inn: numeric("inn", { precision: 12 }),
  accountableFullName: varchar("accountable_full_name").references(
    () => users.fullName
  ),
  status: statusEnum("status").notNull(),
});

const id_nullable = z.string().nullish();
const id_required = z.string();

const clientsValidation = {
  accountNumber: z.number().positive(),
  birthdayDate: z.string().datetime(),
  inn: z.number().positive(),
};

export const selectClientsSchema = createSelectSchema(clients, {
  id: id_required,
  ...clientsValidation,
});
export const insertClientsSchema = createInsertSchema(clients, {
  id: id_nullable,
  ...clientsValidation,
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name").notNull().unique(),
  login: varchar("login").notNull(),
  password: varchar("password").notNull(),
});

const usersValidation = {
  fullName: z.string(),
  login: z
    .string({ required_error: "Логин должен быть указан" })
    .min(5, { message: "Логин должен содержать не менее 5 символов" })
    .max(30, { message: "Логин должен содержать не более 30 символов" }),
  password: z
    .string({ required_error: "Пароль должен быть указан" })
    .min(8, { message: "Пароль должен содержать не менее 8 символов" })
    .max(40, { message: "Пароль должен содержать не более 40 символов" }),
};

export const selectUsersSchema = createSelectSchema(users, {
  id: id_required,
  ...usersValidation,
});
export const insertUsersSchema = createInsertSchema(users, {
  id: id_nullable,
  ...usersValidation,
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  token: varchar("token")
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  expiresAt: timestamp("expires_at")
    .notNull()
    .$defaultFn(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)),
});
