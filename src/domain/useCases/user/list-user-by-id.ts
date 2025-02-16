import { User } from "../../models/user";

export interface ListUserById {
  handle(id: string): Promise<User>;
}