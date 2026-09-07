import { randomUUID } from "node:crypto";
import type { Activity } from "./activity.js";
import type { Student } from "./student.js";

export type GradeStatus = "pending" | "submitted" | "graded";

export class Grade {
  private constructor(
    private _id: string,
    private _student_id: string,
    private _activity_id: string,
    private _score: number | null,
    private _status: GradeStatus,
    private _submitted_at: Date | null,
    private _feedback: string | null,
  ) {}

  public static create(student: Student, activity: Activity): Grade {
    return new Grade(
      randomUUID().toString(),
      student.id,
      activity.id,
      null,
      "pending",
      null,
      null,
    );
  }

  public static restore(
    id: string,
    student_id: string,
    activity_id: string,
    score: number | null,
    status: GradeStatus,
    submitted_at: Date | null,
    feedback: string | null,
  ): Grade {
    return new Grade(
      id,
      student_id,
      activity_id,
      score,
      status,
      submitted_at,
      feedback,
    );
  }

  public submit(): void {
    if (this._status !== "pending") {
      throw new Error("Activity has already been submitted");
    }
    this._status = "submitted";
    this._submitted_at = new Date();
  }

  public grade(score: number, feedback?: string): void {
    if (this._status !== "submitted") {
      throw new Error(
        "Cannot grade an activity that has not been submitted yet",
      );
    }
    if (score < 0 || score > 10) {
      throw new Error("Score must be between 0 and 10");
    }
    this._score = score;
    this._feedback = feedback ?? null;
    this._status = "graded";
  }

  public get id(): string {
    return this._id;
  }

  public get student_id(): string {
    return this._student_id;
  }

  public get activity_id(): string {
    return this._activity_id;
  }

  public get score(): number | null {
    return this._score;
  }

  public get status(): GradeStatus {
    return this._status;
  }

  public get submitted_at(): Date | null {
    return this._submitted_at;
  }

  public get feedback(): string | null {
    return this._feedback;
  }
}
