import { CreateUserAdapter } from "../../../data/useCases/user";
import { CreateUserMongooseRepository } from "../../../infra/db/mongoose/repositories/user";
import { CreateUserZodValidator } from "../../../infra/validators";
import { CreateUserController } from "../../../presentation/controllers/user/create-user";

export const makeCreateUserController = (): CreateUserController => {
  const repository = new CreateUserMongooseRepository();
  const createUser = new CreateUserAdapter(repository);
  const zodValidator = new CreateUserZodValidator();
  return new CreateUserController(createUser, zodValidator);
}
