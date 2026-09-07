import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { school_class_table } from "./school_class.js";

export const activity_table = pgTable("activity", {
  id: uuid("id").primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  delivery_date: timestamp("delivery_date"),
  school_class_id: uuid("school_class_id")
    .references(() => school_class_table.id, { onDelete: "cascade" }),
});
