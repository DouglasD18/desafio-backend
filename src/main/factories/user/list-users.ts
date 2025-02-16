import { ListUsersAdapter } from "../../../data/useCases/user";
import { ListUsersMongooseRepository } from "../../../infra/db/mongoose/repositories/user";
import { ListUsersController } from "../../../presentation/controllers/user/list-users";

export const makeListUsersController = (): ListUsersController => {
  const repository = new ListUsersMongooseRepository();
  const listUsers = new ListUsersAdapter(repository);
  return new ListUsersController(listUsers);
}
