import { ListUsersRepository, UpdateUserRepository } from "../../protocols/user";
import { UpdateUserPayload, User } from "../../../domain/models/user";
import { UpdateUser } from "../../../domain/useCases/user";

export class UpdateUserAdapter implements UpdateUser {
  private readonly updateUserRepository: UpdateUserRepository;
  private readonly listUsersRepository: ListUsersRepository;

  constructor(updateUserRepository: UpdateUserRepository, listUsersRepository: ListUsersRepository) {
    this.updateUserRepository = updateUserRepository;
    this.listUsersRepository = listUsersRepository;
  }

  async handle(data: UpdateUserPayload): Promise<User> {
    const users = await this.listUsersRepository.handle();
    const user = users.find((user) => user.id === data.id);
    if (!user) {
      return;
    }
    
    await this.updateUserRepository.handle(data);
    return user;
  }
  
}
