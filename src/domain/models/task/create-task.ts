import { TaskStatus } from ".";

export type CreateTaskPayload = {
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
}

export type CreateTaskResponse = {
  id: string;
}
