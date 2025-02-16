import { UpdateUserPayload } from "../../../domain/models/user";

export interface UpdateUserRepository {
  handle(payload: UpdateUserPayload): Promise<boolean>;
}
