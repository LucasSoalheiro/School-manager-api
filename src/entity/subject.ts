import { randomUUID } from "node:crypto";
import type { Teacher } from "./teacher.js";
import type { School_class } from "./school_class.js";

export class Subject {
  private constructor(
    private _id: string,
    private _name: string,
    private _description: string,
    private _teacher_id: string,
    private _school_class_id: string,
  ) {}

  public static create(
    name: string,
    description: string,
    teacher: Teacher,
    school_class: School_class,
  ): Subject {
    if (name.trim().length < 2) {
      throw new Error("Subject name is too short");
    }
    if (!teacher.is_active) {
      throw new Error("Cannot assign an inactive teacher to a subject");
    }
    if (!school_class.is_active) {
      throw new Error("Cannot assign a subject to an inactive class");
    }

    return new Subject(
      randomUUID().toString(),
      name.trim(),
      description.trim(),
      teacher.id,
      school_class.id,
    );
  }

  public static restore(
    id: string,
    name: string,
    description: string,
    teacher_id: string,
    school_class_id: string,
  ): Subject {
    return new Subject(id, name, description, teacher_id, school_class_id);
  }

  public update_name(new_name: string): void {
    if (new_name.trim().length < 2) {
      throw new Error("Subject name is too short");
    }
    this._name = new_name.trim();
  }

  public update_description(new_description: string): void {
    this._description = new_description.trim();
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }

  public get teacher_id(): string {
    return this._teacher_id;
  }

  public get school_class_id(): string {
    return this._school_class_id;
  }
}
