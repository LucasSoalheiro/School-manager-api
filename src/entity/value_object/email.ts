export class Email{
  private constructor(private _email: string) {
    
  }

  public static create(email: string): Email{
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      throw new Error("Email format invalid")
    }
    return new Email(email);
  }

  public toString(): string{
    return this._email.toLowerCase();
  }
}