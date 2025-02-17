import { ListTasksAdapter } from "../../../data/useCases/task";
import { ListTasksMongooseRepository } from "../../../infra/db/mongoose/repositories/task";
import { ListTasksController } from "../../../presentation/controllers/task/list-tasks";

export const makeListTasksController = (): ListTasksController => {
  const repository = new ListTasksMongooseRepository();
  const listTasks = new ListTasksAdapter(repository);
  return new ListTasksController(listTasks);
}
