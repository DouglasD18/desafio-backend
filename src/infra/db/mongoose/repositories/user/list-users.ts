import { ListUsersRepository } from "../../../../../data/protocols/user";
import { ListUsersResponse } from "../../../../../domain/models/user";
import { UserModel } from "../../schemas";

export class ListUsersMongooseRepository implements ListUsersRepository {
  async handle(): Promise<ListUsersResponse> {
    const users = await UserModel.find({});

    return users.map(user => ({
      id: user._id.toString(), 
      name: user.name,
      email: user.email
    }));
  }
}
