import { CreateTaskPayload, CreateTaskResponse } from "../../models/task";

export interface CreateTask {
  handle(data: CreateTaskPayload): Promise<CreateTaskResponse>
}
