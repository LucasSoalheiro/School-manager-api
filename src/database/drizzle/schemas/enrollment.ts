import { pgEnum, pgTable, timestamp, uuid, uniqueIndex, index } from "drizzle-orm/pg-core";
import { student_table } from "./student.js";
import { school_class_table } from "./school_class.js";

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active",
  "cancelled",
  "concluded",
]);

export const enrollment_table = pgTable(
  "enrollment",
  {
    id: uuid("id").primaryKey(),
    student_id: uuid("student_id")
      .notNull()
      .references(() => student_table.id, { onDelete: "cascade" }),
    school_class_id: uuid("school_class_id")
      .notNull()
      .references(() => school_class_table.id, { onDelete: "cascade" }),
    enrolled_at: timestamp("enrolled_at").defaultNow().notNull(),
    status: enrollmentStatusEnum("status").default("active").notNull(),
  },
  (table) => [
    uniqueIndex("enrollment_student_class_idx").on(table.student_id, table.school_class_id),
    index("enrollment_school_class_id_idx").on(table.school_class_id),
    index("enrollment_student_id_idx").on(table.student_id),
  ],
);
