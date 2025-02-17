import { UpdateStatusPayload } from "../../../domain/models/task";

export interface UpdateStatusRepository {
  handle(payload: UpdateStatusPayload): Promise<boolean>;
}
