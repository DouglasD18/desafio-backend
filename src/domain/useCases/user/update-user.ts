import { UpdateUserPayload } from "../../models/user";

export interface UpdateUser {
  handle(data: UpdateUserPayload): Promise<boolean>
}
