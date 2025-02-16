import { CreateTaskPayload } from "../../../domain/models/task";

export interface CreateTaskRepository {
  handle(payload: CreateTaskPayload): Promise<string>;
}
