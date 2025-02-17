import { ListUserByIdMongooseRepository } from "../../../infra/db/mongoose/repositories/user";
import { ListTasksByUserAdapter } from "../../../data/useCases/user";
import { ListTasksByUserMongooseRepository } from "../../../infra/db/mongoose/repositories/task";
import { DeleteUserZodValidator } from "../../../infra/validators/user";
import { ListTasksByUserController } from "../../../presentation/controllers/user/list-tasks-by-user";

export const makeListTasksByUserController = (): ListTasksByUserController => {
  const repository = new ListTasksByUserMongooseRepository();
  const listUserById = new ListUserByIdMongooseRepository();
  const ListTasksByUser = new ListTasksByUserAdapter(repository, listUserById);
  const zodValidator = new DeleteUserZodValidator();
  return new ListTasksByUserController(ListTasksByUser, zodValidator);
}
