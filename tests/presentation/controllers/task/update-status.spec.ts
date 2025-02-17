import { UpdateStatusController } from "@/presentation/controllers/task/update-status";
import { UpdateStatus } from "@/domain/useCases/task";
import { Validator } from "@/domain/useCases/validator";
import { HttpRequest } from "@/presentation/protocols";
import { badRequest, noContent, internalServerError, notFound } from "@/presentation/helpers/http";
import { TaskStatus, UpdateStatusPayload } from "@/domain/models/task";
import { Validated } from "@/domain/models/validated";

const VALIDATED: Validated = { isValid: true };
const TASK_ID = "any_task_id";

const REQUEST: HttpRequest = {
  params: {
    id: TASK_ID
  },
  body: {
    status: TaskStatus.PENDING,
  }
};

const makeUpdateStatusStub = (): UpdateStatus => {
  class UpdateStatusStub implements UpdateStatus {
    async handle(payload: UpdateStatusPayload): Promise<boolean> {
      return true;
    }
  }
  return new UpdateStatusStub();
};

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    handle(): Validated {
      return VALIDATED;
    }
  }
  return new ValidatorStub();
};

interface SutTypes {
  sut: UpdateStatusController;
  updateStatusStub: UpdateStatus;
  validatorStub: Validator;
}

const makeSut = (): SutTypes => {
  const updateStatusStub = makeUpdateStatusStub();
  const validatorStub = makeValidatorStub();
  const sut = new UpdateStatusController(updateStatusStub, validatorStub);

  return { sut, updateStatusStub, validatorStub };
};

describe("UpdateStatusController", () => {
  it("Should call Validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();

    const validateSpy = jest.spyOn(validatorStub, "handle");
    await sut.handle(REQUEST);

    expect(validateSpy).toHaveBeenCalledWith({ ...REQUEST.body, ...REQUEST.params });
  });

  it("Should return 400 if Validator returns isValid false", async () => {
    const { sut, validatorStub } = makeSut();

    jest.spyOn(validatorStub, "handle").mockReturnValue({ isValid: false, message: "Validation error" });
    const response = await sut.handle(REQUEST);

    expect(response).toEqual(badRequest("Validation error"));
  });

  it("Should call UpdateStatus with correct values", async () => {
    const { sut, updateStatusStub } = makeSut();

    const UpdateStatusSpy = jest.spyOn(updateStatusStub, "handle");
    await sut.handle(REQUEST);

    expect(UpdateStatusSpy).toHaveBeenCalledWith({ ...REQUEST.body, ...REQUEST.params });
  });

  it("Should return 404 if UpdateStatus returns false", async () => {
    const { sut, updateStatusStub } = makeSut();

    jest.spyOn(updateStatusStub, "handle").mockResolvedValue(false);
    const response = await sut.handle(REQUEST);

    expect(response).toEqual(notFound("Tarefa não encontrada"));
  });

  it("Should return 500 if UpdateStatus throws", async () => {
    const { sut, updateStatusStub } = makeSut();

    jest.spyOn(updateStatusStub, "handle").mockImplementation(() => {
      throw new Error("Internal error");
    });
    const response = await sut.handle(REQUEST);

    expect(response).toEqual(internalServerError("Internal error"));
  });

  it("Should return 204 and task ID if successful", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(REQUEST);

    expect(response).toEqual(noContent());
  });
});
