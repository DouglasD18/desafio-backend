import { UpdateUserRepository } from "../../protocols/user";
import { UpdateUserPayload } from "../../../domain/models/user";
import { UpdateUser } from "../../../domain/useCases/user";

export class UpdateUserAdapter implements UpdateUser {
  private readonly updateUserRepository: UpdateUserRepository;

  constructor(updateUserRepository: UpdateUserRepository) {
    this.updateUserRepository = updateUserRepository;
  }

  async handle(data: UpdateUserPayload): Promise<boolean> {
    return await this.updateUserRepository.handle(data);
  }
  
}
