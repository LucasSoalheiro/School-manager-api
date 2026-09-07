import { randomUUID } from "node:crypto";
import type { Email } from "./value_object/email.js";
import { Password } from "./value_object/password.js";
import { User } from "./user.js";
import type { School_class } from "./school_class.js";

export class Teacher extends User {
  private constructor(
    _id: string,
    _email: string,
    _name: string,
    _last_name: string,
    _hashed_password: string,
    private _school_classes: Array<School_class>,
  ) {
    super(_id, _email, _name, _last_name, _hashed_password, true);
  }

  public static async create(
    name: string,
    last_name: string,
    email: Email,
    password: string,
  ): Promise<Teacher> {
    if (name.length < 3) {
      throw new Error("Name is too short");
    }
    if (name.length > 50) {
      throw new Error("Name is too long");
    }
    if (last_name.length < 3) {
      throw new Error("Last name is too short");
    }
    if (last_name.length > 50) {
      throw new Error("Last name is too long");
    }

    const hashed_password = await Password.create(password);

    return new Teacher(
      randomUUID().toString(),
      email.toString(),
      name,
      last_name,
      hashed_password.toString(),
      [],
    );
  }

  public static restore(
    id: string,
    email: string,
    name: string,
    last_name: string,
    hashed_password: string,
    status: boolean,
    school_classes: Array<School_class> = [],
  ): Teacher {
    const teacher = new Teacher(
      id,
      email,
      name,
      last_name,
      hashed_password,
      school_classes,
    );
    if (!status) teacher.deactivate();
    return teacher;
  }

  public add_class(school_class: School_class): void {
    const already_added = this._school_classes.some(
      (sc) => sc.id === school_class.id,
    );
    if (already_added) {
      throw new Error("This class is already assigned to the teacher");
    }
    this._school_classes.push(school_class);
  }

  public remove_class(class_id: string): void {
    const index = this._school_classes.findIndex((sc) => sc.id === class_id);
    if (index === -1) {
      throw new Error("Class not found for this teacher");
    }
    this._school_classes.splice(index, 1);
  }

  public get school_classes(): ReadonlyArray<School_class> {
    return this._school_classes;
  }
}
