import { DeleteTaskRepository } from "../../../../../data/protocols/task";
import { TaskModel } from "../../schemas";

export class DeleteTaskMongooseRepository implements DeleteTaskRepository {
  async handle(id: string): Promise<boolean> {
    const result = await TaskModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
