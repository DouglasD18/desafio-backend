import { CreateUserPayload } from "@/domain/models/user";

export interface CreateUserModel {
  handle(payload: CreateUserPayload): Promise<string>;
}
