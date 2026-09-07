import { Password } from "./value_object/password.js";

export abstract class User {
  protected constructor(
    protected _id: string,
    protected _email: string,
    protected _name: string,
    protected _last_name: string,
    protected _hashed_password: string,
    protected _status: boolean,
  ) {}

  public async change_password(
    current_password: string,
    new_password: string,
  ): Promise<void> {
    const current_is_correct = await Password.compare(
      current_password,
      this._hashed_password,
    );
    if (!current_is_correct) {
      throw new Error("Current password is incorrect");
    }

    const new_is_same = await Password.compare(
      new_password,
      this._hashed_password,
    );
    if (new_is_same) {
      throw new Error("New password must be different from the current one");
    }

    this._hashed_password = (await Password.create(new_password)).toString();
  }

  public set name(new_name: string) {
    this._name = new_name;
  }

  public set last_name(new_last_name: string) {
    this._last_name = new_last_name;
  }

  public get id(): string {
    return this._id;
  }

  public get email(): string {
    return this._email;
  }

  public get name(): string {
    return this._name;
  }

  public get last_name(): string {
    return this._last_name;
  }

  public get full_name(): string {
    return `${this._name} ${this._last_name}`;
  }

  public get hashed_password(): string {
    return this._hashed_password;
  }

  public get is_active(): boolean {
    return this._status;
  }

  public deactivate(): void {
    this._status = false;
  }

  public activate(): void {
    this._status = true;
  }
}
