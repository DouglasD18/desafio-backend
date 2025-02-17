import { Task } from "../../models/task";

export interface ListTasks {
  handle(): Promise<Task[]>
}
