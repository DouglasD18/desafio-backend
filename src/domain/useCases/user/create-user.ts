import { CreateUserPayload, CreateUserResponse } from "../../models/user";

export interface CreateUser {
  handle(data: CreateUserPayload): Promise<CreateUserResponse>
}
