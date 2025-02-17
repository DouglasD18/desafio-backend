import { TaskByUser } from "../../models/task";

export interface ListTaskByUser {
  handle(id: string): Promise<TaskByUser[]>
}
