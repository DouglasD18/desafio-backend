import { UpdateUserRepository } from "../../../../../data/protocols/user";
import { UpdateUserPayload } from "../../../../../domain/models/user";
import { UserModel } from "../../schemas/user";

export class UpdateUserMongooseRepository implements UpdateUserRepository {
  async handle(payload: UpdateUserPayload): Promise<void> {
    const { id, ...updateData } = payload;
    await UserModel.updateOne({ _id: id }, { $set: updateData });
  }
}
