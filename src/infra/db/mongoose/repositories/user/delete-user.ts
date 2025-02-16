import { DeleteUserRepository } from "../../../../../data/protocols/user";
import { UserModel } from "../../schemas/user";

export class DeleteUserMongooseRepository implements DeleteUserRepository {
  async handle(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
