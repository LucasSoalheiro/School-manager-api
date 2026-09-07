import { randomUUID } from "node:crypto";

export class Activity {
  private constructor(
    private _id: string,
    private _title: string,
    private _description: string,
    private _created_at: Date,
    private _delivery_date?: Date,
    private _school_class_id?: string,
  ) {}

  public static create(
    title: string,
    description: string,
    delivery_date?: Date,
    school_class_id?: string,
  ): Activity {
    if (title.trim().length < 3) {
      throw new Error("Activity title is too short");
    }
    if (description.trim().length < 10) {
      throw new Error("Activity description is too short");
    }
    if (delivery_date && delivery_date <= new Date()) {
      throw new Error("Delivery date must be in the future");
    }

    return new Activity(
      randomUUID().toString(),
      title.trim(),
      description.trim(),
      new Date(),
      delivery_date,
      school_class_id,
    );
  }

  public static restore(
    id: string,
    title: string,
    description: string,
    created_at: Date,
    delivery_date?: Date,
    school_class_id?: string,
  ): Activity {
    return new Activity(
      id,
      title,
      description,
      created_at,
      delivery_date,
      school_class_id,
    );
  }

  public update_delivery_date(new_date: Date): void {
    if (new_date <= new Date()) {
      throw new Error("Delivery date must be in the future");
    }
    this._delivery_date = new_date;
  }

  public get id(): string {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public get description(): string {
    return this._description;
  }

  public get created_at(): Date {
    return this._created_at;
  }

  public get delivery_date(): Date | undefined {
    return this._delivery_date;
  }

  public get school_class_id(): string | undefined {
    return this._school_class_id;
  }

  public set school_class_id(id: string | undefined) {
    this._school_class_id = id;
  }
}
