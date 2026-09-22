import { randomUUID } from "node:crypto";
import type { Activity } from "./activity.js";
import type { Student } from "./student.js";

export class School_class {
  private constructor(
    private _id: string,
    private _class_name: string,
    private _students: Student[],
    private _activities: Activity[],
    private _status_class: boolean,
    private _teacher_id: string | null = null,
  ) {}

  public static create(class_name: string, teacher_id?: string | null): School_class {
    if (class_name.trim().length < 2) {
      throw new Error("Class name is too short");
    }
    return new School_class(
      randomUUID().toString(),
      class_name.trim(),
      [],
      [],
      true,
      teacher_id ?? null,
    );
  }

  public static restore(
    id: string,
    class_name: string,
    students: Student[],
    activities: Activity[],
    status_class: boolean,
    teacher_id: string | null = null,
  ): School_class {
    return new School_class(id, class_name, students, activities, status_class, teacher_id);
  }

  public add_student(student: Student): void {
    const already_enrolled = this._students.some((s) => s.id === student.id);
    if (already_enrolled) {
      throw new Error("Student is already enrolled in this class");
    }
    this._students.push(student);
  }

  public remove_student(student_id: string): void {
    const index = this._students.findIndex((s) => s.id === student_id);
    if (index === -1) {
      throw new Error("Student not found in this class");
    }
    this._students.splice(index, 1);
  }

  public add_activity(activity: Activity): void {
    this._activities.push(activity);
  }

  public remove_activity(activity_id: string): void {
    const index = this._activities.findIndex((a) => a.id === activity_id);
    if (index === -1) {
      throw new Error("Activity not found in this class");
    }
    this._activities.splice(index, 1);
  }

  public close(): void {
    this._status_class = false;
  }

  public reopen(): void {
    this._status_class = true;
  }

  public get id(): string {
    return this._id;
  }

  public get class_name(): string {
    return this._class_name;
  }

  public get students(): ReadonlyArray<Student> {
    return this._students;
  }

  public get activities(): ReadonlyArray<Activity> {
    return this._activities;
  }

  public get is_active(): boolean {
    return this._status_class;
  }

  public get teacher_id(): string | null {
    return this._teacher_id;
  }

  public set teacher_id(id: string | null) {
    this._teacher_id = id;
  }
}
