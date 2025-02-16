import { ListUsersRepository } from "../../protocols/user";
import { ListUsersResponse } from "../../../domain/models/user";
import { ListUsers } from "../../../domain/useCases/user";

export class ListUsersAdapter implements ListUsers {
  private readonly listUsersRepository: ListUsersRepository;

  constructor(listUsersRepository: ListUsersRepository) {
    this.listUsersRepository = listUsersRepository;
  }

  async handle(): Promise<ListUsersResponse> {
    const users = await this.listUsersRepository.handle();
    return users;
  }
  
}
