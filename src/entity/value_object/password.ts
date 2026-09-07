import { hash, compare } from "bcrypt";
import { loadConfig } from "../../config/env.js";

export class Password {
  private constructor(private _hashed_password: string) {}

  public static async create(password: string): Promise<Password> {
    if (password.length < 5) {
      throw new Error("Password too short, it needs at least 5 characters");
    }
    if (!/[0-9]/.test(password)) {
      throw new Error("Password needs at least one digit");
    }
    if (!/[@$!%*?&]/.test(password)) {
      throw new Error("Password needs at least one special character (@$!%*?&)");
    }

    const hashed_password = await hash(password, loadConfig().salt_rounds);
    return new Password(hashed_password);
  }

  public static async compare(
    password: string,
    hashed_password: string,
  ): Promise<boolean> {
    return await compare(password, hashed_password);
  }

  public toString(): string {
    return this._hashed_password;
  }
}