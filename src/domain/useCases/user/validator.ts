import { Validated } from "@/domain/models/user";

export interface Validator {
  handle(body: any): Validated;
}
