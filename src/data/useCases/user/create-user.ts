import { CreateUserRepository } from "../../protocols/user";
import { CreateUserPayload, CreateUserResponse } from "../../../domain/models/user";
import { CreateUser } from "../../../domain/useCases/user";

export class CreateUserAdapter implements CreateUser {
  private readonly createUserRepository: CreateUserRepository;

  constructor(createUserRepository: CreateUserRepository) {
    this.createUserRepository = createUserRepository;
  }

  async handle(data: CreateUserPayload): Promise<CreateUserResponse> {
    const id = await this.createUserRepository.handle(data);
    return { id };
  }
  
}
