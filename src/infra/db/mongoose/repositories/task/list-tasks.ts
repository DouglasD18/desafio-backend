import { Task } from "../../../../../domain/models/task";
import { ListTasksRepository } from "../../../../../data/protocols/task";
import { TaskModel } from "../../schemas";
import { TaskStatus } from "../../../../../domain/models/task"; 

export class ListTasksMongooseRepository implements ListTasksRepository {
  async handle(): Promise<Task[]> {
    const tasks = await TaskModel.find();

    return tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      userId: task.userId.toString()
    }));
  }
}
