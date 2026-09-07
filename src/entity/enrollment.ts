import { randomUUID } from "node:crypto";
import type { Student } from "./student.js";
import type { School_class } from "./school_class.js";

export type EnrollmentStatus = "active" | "cancelled" | "concluded";

export class Enrollment {
  private constructor(
    private _id: string,
    private _student_id: string,
    private _school_class_id: string,
    private _enrolled_at: Date,
    private _status: EnrollmentStatus,
  ) {}

  public static create(
    student: Student,
    school_class: School_class,
  ): Enrollment {
    if (!student.is_active) {
      throw new Error("Cannot enroll an inactive student");
    }
    if (!school_class.is_active) {
      throw new Error("Cannot enroll a student in an inactive class");
    }

    return new Enrollment(
      randomUUID().toString(),
      student.id,
      school_class.id,
      new Date(),
      "active",
    );
  }

  public static restore(
    id: string,
    student_id: string,
    school_class_id: string,
    enrolled_at: Date,
    status: EnrollmentStatus,
  ): Enrollment {
    return new Enrollment(id, student_id, school_class_id, enrolled_at, status);
  }

  public cancel(): void {
    if (this._status !== "active") {
      throw new Error(`Cannot cancel an enrollment with status "${this._status}"`);
    }
    this._status = "cancelled";
  }

  public conclude(): void {
    if (this._status !== "active") {
      throw new Error(
        `Cannot conclude an enrollment with status "${this._status}"`,
      );
    }
    this._status = "concluded";
  }

  public get id(): string {
    return this._id;
  }

  public get student_id(): string {
    return this._student_id;
  }

  public get school_class_id(): string {
    return this._school_class_id;
  }

  public get enrolled_at(): Date {
    return this._enrolled_at;
  }

  public get status(): EnrollmentStatus {
    return this._status;
  }

  public get is_active(): boolean {
    return this._status === "active";
  }
}
