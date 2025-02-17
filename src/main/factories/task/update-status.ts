import { UpdateStatusAdapter } from "../../../data/useCases/task";
import { UpdateStatusMongooseRepository } from "../../../infra/db/mongoose/repositories/task";
import { UpdateStatusZodValidator } from "../../../infra/validators/task";
import { UpdateStatusController } from "../../../presentation/controllers/task/update-status";

export const makeUpdateStatusController = (): UpdateStatusController => {
  const repository = new UpdateStatusMongooseRepository();
  const updateStatus = new UpdateStatusAdapter(repository);
  const zodValidator = new UpdateStatusZodValidator();
  return new UpdateStatusController(updateStatus, zodValidator);
}
