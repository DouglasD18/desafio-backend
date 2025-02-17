import { TaskByUser } from "../../../../../domain/models/task";
import { ListTasksByUserRepository } from "../../../../../data/protocols/task";
import { TaskModel } from "../../schemas";
import { TaskStatus } from "../../../../../domain/models/task"; 

export class ListTasksByUserMongooseRepository implements ListTasksByUserRepository {
  async handle(id: string): Promise<TaskByUser[]> {
    const tasks = await TaskModel.find({ userId: id });

    return tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      createdAt: task.createdAt
    }));
  }
}
