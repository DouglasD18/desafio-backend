import { TaskStatus } from "."

export type UpdateStatusPayload = {
  id: string,
  status: TaskStatus
}