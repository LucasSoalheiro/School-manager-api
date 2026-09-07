import { pgTable, varchar, boolean, uuid } from "drizzle-orm/pg-core";

export const teacher_table = pgTable("teacher", {
  id: uuid("id").primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 50 }).notNull(),
  last_name: varchar({ length: 50 }).notNull(),
  hashed_password: varchar({ length: 255 }).notNull(),
  status: boolean().default(true).notNull()
});
