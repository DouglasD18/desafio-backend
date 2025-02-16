import { ListUsersResponse } from "../../models/user";

export interface ListUsers {
  handle(): Promise<ListUsersResponse>;
}