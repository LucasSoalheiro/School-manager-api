import { pgEnum, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { student_table } from "./student.js";
import { activity_table } from "./activity.js";

export const gradeStatusEnum = pgEnum("grade_status", [
  "pending",
  "submitted",
  "graded",
]);

export const grade_table = pgTable("grade", {
  id: uuid("id").primaryKey(),
  student_id: uuid("student_id")
    .notNull()
    .references(() => student_table.id, { onDelete: "cascade" }),
  activity_id: uuid("activity_id")
    .notNull()
    .references(() => activity_table.id, { onDelete: "cascade" }),
  score: real("score"),
  status: gradeStatusEnum("status").default("pending").notNull(),
  submitted_at: timestamp("submitted_at"),
  feedback: text("feedback"),
});
