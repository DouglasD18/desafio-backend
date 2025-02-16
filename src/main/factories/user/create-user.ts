import { CreateUserAdapter } from "@/data/useCases/user";
import { CreateUserMongooseRepository } from "@/infra/db/mongoose/repositories/user";
import { ZodValidator } from "@/infra/validators/zod-validator";
import { CreateUserController } from "@/presentation/controllers/user/create-user";

export const makeCreateUserController = (): CreateUserController => {
  const repository = new CreateUserMongooseRepository();
  const createUser = new CreateUserAdapter(repository);
  const zodValidator = new ZodValidator();
  return new CreateUserController(createUser, zodValidator);
}
