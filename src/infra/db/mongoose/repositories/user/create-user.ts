import { CreateUserRepository } from "@/data/protocols/user";
import { CreateUserPayload } from "@/domain/models/user";
import { UserModel } from "../../schemas/user";

export class CreateUserMongooseRepository implements CreateUserRepository {
  async handle(payload: CreateUserPayload): Promise<string> {
    const user = await UserModel.create(payload);
    return user.id;
  }
}
