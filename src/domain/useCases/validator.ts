import { Validated } from "../models/validated";

export interface Validator {
  handle(body: any): Validated;
}
