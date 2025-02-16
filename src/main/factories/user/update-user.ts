import { UpdateUserAdapter } from "../../../data/useCases/user";
import { UpdateUserMongooseRepository } from "../../../infra/db/mongoose/repositories/user";
import { UpdateUserZodValidator } from "../../../infra/validators";
import { UpdateUserController } from "../../../presentation/controllers/user/update-user";

export const makeUpdateUserController = (): UpdateUserController => {
  const repository = new UpdateUserMongooseRepository();
  const updateUser = new UpdateUserAdapter(repository);
  const zodValidator = new UpdateUserZodValidator();
  return new UpdateUserController(updateUser, zodValidator);
}
