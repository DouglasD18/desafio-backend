import { User } from "../../../domain/models/user";
import { ListUserById } from "../../../domain/useCases/user";
import { ListUserByIdRepository } from "../../protocols/user";

export class ListUserByIdAdapter implements ListUserById {
  private readonly listUserByIdRepository: ListUserByIdRepository;
  constructor(listUserByIdRepository: ListUserByIdRepository) {
    this.listUserByIdRepository = listUserByIdRepository;
  }
  
  async handle(id: string): Promise<User> {
    return await this.listUserByIdRepository.handle(id);
  }

}