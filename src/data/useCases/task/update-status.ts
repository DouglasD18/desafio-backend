import { UpdateStatusRepository } from "../../protocols/task";
import { UpdateStatusPayload } from "../../../domain/models/task";
import { UpdateStatus } from "../../../domain/useCases/task";

export class UpdateStatusAdapter implements UpdateStatus {
  private readonly updateStatusRepository: UpdateStatusRepository;

  constructor(updateStatusRepository: UpdateStatusRepository) {
    this.updateStatusRepository = updateStatusRepository;
  }

  async handle(data: UpdateStatusPayload): Promise<boolean> {
    return await this.updateStatusRepository.handle(data);
  }
  
}
