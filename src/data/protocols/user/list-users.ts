import { ListUsersResponse } from "../../../domain/models/user";

export interface ListUsersRepository {
  handle(): Promise<ListUsersResponse>;
}