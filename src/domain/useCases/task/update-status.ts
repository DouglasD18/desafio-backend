import { UpdateStatusPayload } from "../../models/task";

export interface UpdateStatus {
  handle(data: UpdateStatusPayload): Promise<boolean>
}
