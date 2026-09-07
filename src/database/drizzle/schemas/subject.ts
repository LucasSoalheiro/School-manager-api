import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { teacher_table } from "./teacher.js";
import { school_class_table } from "./school_class.js";

export const subject_table = pgTable("subject", {
  id: uuid("id").primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  description: text().notNull(),
  teacher_id: uuid("teacher_id")
    .notNull()
    .references(() => teacher_table.id, { onDelete: "cascade" }),
  school_class_id: uuid("school_class_id")
    .notNull()
    .references(() => school_class_table.id, { onDelete: "cascade" }),
});
