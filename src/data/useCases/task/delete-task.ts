import { DeleteTaskRepository } from "../../protocols/task";
import { DeleteTask } from "../../../domain/useCases/task";

export class DeleteTaskAdapter implements DeleteTask {
  private readonly deleteTaskRepository: DeleteTaskRepository;

  constructor(deleteTaskRepository: DeleteTaskRepository) {
    this.deleteTaskRepository = deleteTaskRepository;
  }

  async handle(id: string): Promise<boolean> {
    return await this.deleteTaskRepository.handle(id);
  }
  
}
