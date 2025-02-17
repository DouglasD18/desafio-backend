import { User } from "../../../../../domain/models/user";
import { ListUserByIdRepository } from "../../../../../data/protocols/user";
import { UserModel } from "../../schemas/user";

export class ListUserByIdMongooseRepository implements ListUserByIdRepository {
  async handle(id: string): Promise<User> {
    const user = await UserModel.findById(id);

    if (!user) return null; 

    return {
      id: user._id.toString(), 
      name: user.name,
      email: user.email
    };
  }
}
