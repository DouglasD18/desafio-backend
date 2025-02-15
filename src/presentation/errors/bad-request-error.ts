export class BadRequestError extends Error {
  constructor(message: string) {
    super("Bad Request Error!");
    this.message = message;
  }
}
