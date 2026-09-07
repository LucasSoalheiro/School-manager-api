import { defineRelations } from "drizzle-orm";
import { teacher_table as teacher } from "./teacher.js";
import { school_class_table as school_class } from "./school_class.js";
import { student_table as student } from "./student.js";
import { subject_table as subject } from "./subject.js";
import { enrollment_table as enrollment } from "./enrollment.js";
import { activity_table as activity } from "./activity.js";
import { grade_table as grade } from "./grade.js";

export const relations = defineRelations(
  { teacher, school_class, student, subject, enrollment, activity, grade },
  (t) => ({
    teacher: {
      school_classes: t.many.school_class(),
      subjects: t.many.subject(),
    },
    student: {
      enrollments: t.many.enrollment(),
      grades: t.many.grade(),
    },
    school_class: {
      teacher: t.one.teacher({
        from: t.school_class.teacher_id,
        to: t.teacher.id,
      }),
      enrollments: t.many.enrollment(),
      subjects: t.many.subject(),
      activities: t.many.activity(),
    },
    subject: {
      teacher: t.one.teacher({
        from: t.subject.teacher_id,
        to: t.teacher.id,
      }),
      school_class: t.one.school_class({
        from: t.subject.school_class_id,
        to: t.school_class.id,
      }),
    },
    enrollment: {
      student: t.one.student({
        from: t.enrollment.student_id,
        to: t.student.id,
      }),
      school_class: t.one.school_class({
        from: t.enrollment.school_class_id,
        to: t.school_class.id,
      }),
    },
    activity: {
      school_class: t.one.school_class({
        from: t.activity.school_class_id,
        to: t.school_class.id,
      }),
      grades: t.many.grade(),
    },
    grade: {
      student: t.one.student({
        from: t.grade.student_id,
        to: t.student.id,
      }),
      activity: t.one.activity({
        from: t.grade.activity_id,
        to: t.activity.id,
      }),
    },
  }),
);

