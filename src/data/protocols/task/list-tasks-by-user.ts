import { TaskByUser } from "../../../domain/models/task";

export interface ListTasksByUserRepository {
  handle(userId: string): Promise<TaskByUser[]>
}
