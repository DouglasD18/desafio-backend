import { UpdateUserPayload, User } from "../../models/user";

export interface UpdateUser {
  handle(data: UpdateUserPayload): Promise<User>
}
