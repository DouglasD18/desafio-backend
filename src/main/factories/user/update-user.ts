import { UpdateUserAdapter } from "../../../data/useCases/user";
import { ListUsersMongooseRepository, UpdateUserMongooseRepository } from "../../../infra/db/mongoose/repositories/user";
import { UpdateUserZodValidator } from "../../../infra/validators";
import { UpdateUserController } from "../../../presentation/controllers/user/update-user";

export const makeUpdateUserController = (): UpdateUserController => {
  const repository = new UpdateUserMongooseRepository();
  const listUsersRepository = new ListUsersMongooseRepository
  const updateUser = new UpdateUserAdapter(repository, listUsersRepository);
  const zodValidator = new UpdateUserZodValidator();
  return new UpdateUserController(updateUser, zodValidator);
}
