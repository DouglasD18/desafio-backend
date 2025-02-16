import { CreateUserPayload } from "../../../domain/models/user";

export interface CreateUserRepository {
  handle(payload: CreateUserPayload): Promise<string>;
}
