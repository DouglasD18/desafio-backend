import { CreateUserPayload, CreateUserResponse } from "@/domain/models/user";

export interface CreateUser {
  handle(data: CreateUserPayload): Promise<CreateUserResponse>
}
