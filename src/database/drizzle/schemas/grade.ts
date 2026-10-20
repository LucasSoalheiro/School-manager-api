import { pgEnum, pgTable, real, text, timestamp, uuid, uniqueIndex, index } from "drizzle-orm/pg-core";
import { student_table } from "./student.js";
import { activity_table } from "./activity.js";

export const gradeStatusEnum = pgEnum("grade_status", [
  "pending",
  "submitted",
  "graded",
]);

export const grade_table = pgTable(
  "grade",
  {
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
  },
  (table) => [
    uniqueIndex("grade_student_activity_idx").on(table.student_id, table.activity_id),
    index("grade_activity_id_idx").on(table.activity_id),
    index("grade_student_id_idx").on(table.student_id),
  ],
);
