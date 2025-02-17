import { UpdateUserRepository } from "../../../../../data/protocols/user";
import { UpdateUserPayload } from "../../../../../domain/models/user";
import { UserModel } from "../../schemas";

export class UpdateUserMongooseRepository implements UpdateUserRepository {
  async handle(payload: UpdateUserPayload): Promise<boolean> {
    const { id, ...updateData } = payload;
    const result = await UserModel.updateOne({ _id: id }, { $set: updateData });
    return result.modifiedCount > 0;
  }
}
