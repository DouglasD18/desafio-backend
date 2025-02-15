import { BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { HttpResponse } from "../protocols";

export const badRequest = (message: string): HttpResponse => ({
  statusCode: 400,
  body: new BadRequestError(message)
});

export const internalServerError = (message: string): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(message)
});

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body
});

export const created = (body: any): HttpResponse => ({
  statusCode: 201,
  body
});

export const notFound = (message: string): HttpResponse => ({
  statusCode: 404,
  body: new NotFoundError(message)
});
