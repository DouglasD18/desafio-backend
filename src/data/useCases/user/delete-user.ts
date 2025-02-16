import { DeleteUserRepository } from "../../protocols/user";
import { DeleteUser } from "../../../domain/useCases/user";

export class DeleteUserAdapter implements DeleteUser {
  private readonly deleteUserRepository: DeleteUserRepository;

  constructor(deleteUserRepository: DeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository;
  }

  async handle(id: string): Promise<boolean> {
    return await this.deleteUserRepository.handle(id);
  }
  
}
