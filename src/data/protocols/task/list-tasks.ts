import { Task } from "../../../domain/models/task";

export interface ListTasksRepository {
  handle(): Promise<Task[]>
}
