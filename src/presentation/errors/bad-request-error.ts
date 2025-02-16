export class BadRequestError extends Error {
  constructor(message: string) {
    super("Bad Request Error!");
    this.message = message;
  }

  toJSON() {
    return { message: this.message };
  }
}
