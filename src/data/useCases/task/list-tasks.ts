import { ListTasksRepository } from "../../protocols/task";
import { Task } from "../../../domain/models/task";
import { ListTasks } from "../../../domain/useCases/task";

export class ListTasksAdapter implements ListTasks {
  private readonly listTasksRepository: ListTasksRepository;

  constructor(listTasksRepository: ListTasksRepository) {
    this.listTasksRepository = listTasksRepository;
  }

  async handle(): Promise<Task[]> {
    return await this.listTasksRepository.handle();
  }
  
}
