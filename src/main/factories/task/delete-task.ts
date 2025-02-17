import { DeleteTaskAdapter } from "../../../data/useCases/task";
import { DeleteTaskMongooseRepository } from "../../../infra/db/mongoose/repositories/task";
import { DeleteUserZodValidator } from "../../../infra/validators/user";
import { DeleteTaskController } from "../../../presentation/controllers/task/delete-task";

export const makeDeleteTaskController = (): DeleteTaskController => {
  const repository = new DeleteTaskMongooseRepository();
  const deleteTask = new DeleteTaskAdapter(repository);
  const zodValidator = new DeleteUserZodValidator();
  return new DeleteTaskController(deleteTask, zodValidator);
}
