import { CreateTaskRepository } from "../../protocols/task";
import { CreateTask } from "../../../domain/useCases/task";
import { CreateTaskPayload, CreateTaskResponse } from "../../../domain/models/task";

export class CreateTaskAdapter implements CreateTask {
  private readonly createTaskRepository: CreateTaskRepository;

  constructor(createTaskRepository: CreateTaskRepository) {
    this.createTaskRepository = createTaskRepository;
  }

  async handle(payload: CreateTaskPayload): Promise<CreateTaskResponse> {
    const id = await this.createTaskRepository.handle(payload);

    return { id };
  }
}
