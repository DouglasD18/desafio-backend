import { CreateUserModel } from "@/data/protocols/user";
import { CreateUserPayload, CreateUserResponse } from "@/domain/models/user";
import { CreateUser } from "@/domain/useCases/user";

export class CreateUserAdapter implements CreateUser {
  private readonly createUserModel: CreateUserModel;

  constructor(createUserModel: CreateUserModel) {
    this.createUserModel = createUserModel;
  }

  async handle(data: CreateUserPayload): Promise<CreateUserResponse> {
    const id = await this.createUserModel.handle(data);
    return { id };
  }
  
}
