import { Validated } from "../../models/user";

export interface Validator {
  handle(body: any): Validated;
}
