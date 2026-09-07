import { randomUUID } from "node:crypto";
import type { Email } from "./value_object/email.js";
import { Password } from "./value_object/password.js";
import { User } from "./user.js";

export class Student extends User {
  private constructor(
    _id: string,
    _email: string,
    _name: string,
    _last_name: string,
    _hashed_password: string,
  ) {
    super(_id, _email, _name, _last_name, _hashed_password, true);
  }

  public static async create(
    name: string,
    last_name: string,
    email: Email,
    password: string,
  ): Promise<Student> {
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

    return new Student(
      randomUUID().toString(),
      email.toString(),
      name,
      last_name,
      hashed_password.toString(),
    );
  }

  /**
   * Reconstrói um Student a partir de dados persistidos (ex: banco de dados).
   */
  public static restore(
    id: string,
    email: string,
    name: string,
    last_name: string,
    hashed_password: string,
    status: boolean,
  ): Student {
    const student = new Student(id, email, name, last_name, hashed_password);
    if (!status) student.deactivate();
    return student;
  }
}
