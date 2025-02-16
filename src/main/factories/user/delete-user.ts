import { DeleteUserAdapter } from "../../../data/useCases/user";
import { DeleteUserMongooseRepository } from "../../../infra/db/mongoose/repositories/user";
import { DeleteUserZodValidator } from "../../../infra/validators";
import { DeleteUserController } from "../../../presentation/controllers/user/delete-user";

export const makeDeleteUserController = (): DeleteUserController => {
  const repository = new DeleteUserMongooseRepository();
  const deleteUser = new DeleteUserAdapter(repository);
  const zodValidator = new DeleteUserZodValidator();
  return new DeleteUserController(deleteUser, zodValidator);
}
