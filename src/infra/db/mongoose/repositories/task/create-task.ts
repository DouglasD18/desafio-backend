import { CreateTaskRepository } from "../../../../../data/protocols/task";
import { CreateTaskPayload } from "../../../../../domain/models/task";
import { TaskModel } from "../../schemas";

export class CreateTaskMongooseRepository implements CreateTaskRepository {
  async handle(payload: CreateTaskPayload): Promise<string> {
    const task = await TaskModel.create(payload);
    return task.id;
  }
}
