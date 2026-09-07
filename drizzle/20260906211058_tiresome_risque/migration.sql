CREATE TYPE "enrollment_status" AS ENUM('active', 'cancelled', 'concluded');--> statement-breakpoint
CREATE TYPE "grade_status" AS ENUM('pending', 'submitted', 'graded');--> statement-breakpoint
CREATE TABLE "activity" (
	"id" uuid PRIMARY KEY,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"delivery_date" timestamp,
	"school_class_id" uuid
);
--> statement-breakpoint
CREATE TABLE "enrollment" (
	"id" uuid PRIMARY KEY,
	"student_id" uuid NOT NULL,
	"school_class_id" uuid NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"status" "enrollment_status" DEFAULT 'active'::"enrollment_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grade" (
	"id" uuid PRIMARY KEY,
	"student_id" uuid NOT NULL,
	"activity_id" uuid NOT NULL,
	"score" real,
	"status" "grade_status" DEFAULT 'pending'::"grade_status" NOT NULL,
	"submitted_at" timestamp,
	"feedback" text
);
--> statement-breakpoint
CREATE TABLE "school_class" (
	"id" uuid PRIMARY KEY,
	"class_name" varchar(50) NOT NULL,
	"teacher_id" uuid,
	"status_class" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" uuid PRIMARY KEY,
	"email" varchar(255) NOT NULL UNIQUE,
	"name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"hashed_password" varchar(255) NOT NULL,
	"status" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"id" uuid PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"teacher_id" uuid NOT NULL,
	"school_class_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher" (
	"id" uuid PRIMARY KEY,
	"email" varchar(255) NOT NULL UNIQUE,
	"name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"hashed_password" varchar(255) NOT NULL,
	"status" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_school_class_id_school_class_id_fkey" FOREIGN KEY ("school_class_id") REFERENCES "school_class"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_id_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_school_class_id_school_class_id_fkey" FOREIGN KEY ("school_class_id") REFERENCES "school_class"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "grade" ADD CONSTRAINT "grade_student_id_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "grade" ADD CONSTRAINT "grade_activity_id_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "school_class" ADD CONSTRAINT "school_class_teacher_id_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_teacher_id_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_school_class_id_school_class_id_fkey" FOREIGN KEY ("school_class_id") REFERENCES "school_class"("id") ON DELETE CASCADE;