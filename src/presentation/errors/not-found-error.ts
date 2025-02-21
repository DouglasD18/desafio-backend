export class NotFoundError extends Error {
  constructor(message: string) {
    super("Not Found Error!");
    this.message = message;
  }

  toJSON() {
    return { message: this.message };
  }
}
