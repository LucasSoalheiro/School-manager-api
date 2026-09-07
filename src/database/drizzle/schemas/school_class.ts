import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { teacher_table } from "./teacher.js";

export const school_class_table = pgTable("school_class", {
  id: uuid("id").primaryKey(),
  class_name: varchar({ length: 50 }).notNull(),
  teacher_id: uuid("teacher_id").references(() => teacher_table.id, {
    onDelete: "set null",
  }),
  status_class: boolean().default(true).notNull(),
});


