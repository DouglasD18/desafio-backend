import { User } from "../../../domain/models/user";

export interface ListUserByIdRepository {
  handle(id: string): Promise<User>;
}
