import { ListTasksByUserRepository } from "../../protocols/task";
import { ListUserByIdRepository } from "../../protocols/user";
import { ListTaskByUser } from "../../../domain/useCases/user";

export class ListTasksByUserAdapter implements ListTaskByUser {
  private readonly listTasksByUserRepository: ListTasksByUserRepository;
  private readonly listUserByIdRepository: ListUserByIdRepository;

  constructor(
    listTasksByUserRepository: ListTasksByUserRepository,
    listUserByIdRepository: ListUserByIdRepository
  ) {
    this.listTasksByUserRepository = listTasksByUserRepository;
    this.listUserByIdRepository = listUserByIdRepository;
  }

  async handle(userId: string) {
    const user = await this.listUserByIdRepository.handle(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const tasks = await this.listTasksByUserRepository.handle(userId);
    return tasks;
  }
}