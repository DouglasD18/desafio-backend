export class InternalServerError extends Error {
  constructor(message: string) {
    super(`Internal Server Error`)
    this.name = "ServerError"
    this.message = message
  }
}
