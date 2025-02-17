import { CreateTaskAdapter } from "../../../data/useCases/task";
import { CreateTaskMongooseRepository } from "../../../infra/db/mongoose/repositories/task";
import { CreateTaskZodValidator } from "../../../infra/validators";
import { CreateTaskController } from "../../../presentation/controllers/task/create-task";

export const makeCreateTaskController = (): CreateTaskController => {
  const repository = new CreateTaskMongooseRepository();
  const createTask = new CreateTaskAdapter(repository);
  const zodValidator = new CreateTaskZodValidator();
  return new CreateTaskController(createTask, zodValidator);
}
