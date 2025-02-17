import { UpdateStatusRepository } from "../../../../../data/protocols/task";
import { UpdateStatusPayload } from "../../../../../domain/models/task";
import { TaskModel } from "../../schemas";

export class UpdateStatusMongooseRepository implements UpdateStatusRepository {
  async handle(payload: UpdateStatusPayload): Promise<boolean> {
    const { id, status } = payload;

    const result = await TaskModel.updateOne(
      { _id: id },
      { $set: { status }
    });

    return result.modifiedCount > 0;
  }
}
