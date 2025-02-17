import { ListTaskByUserController } from "@/presentation/controllers/user/list-task-by-user";
import { Validator } from "@/domain/useCases/validator";
import { ListTaskByUser } from "@/domain/useCases/user";
import { HttpRequest } from "@/presentation/protocols";
import { badRequest, internalServerError, ok, notFound } from "@/presentation/helpers/http";
import { Validated } from "@/domain/models/validated";

const VALIDATED: Validated = { isValid: true };
const USER_ID = "any_user_id";

const REQUEST: HttpRequest = {
  params: {
    id: USER_ID
  }
};

const TASKS = [
  { id: "task_1", title: "Task 1", description: "Desc 1", status: "pending" },
  { id: "task_2", title: "Task 2", description: "Desc 2", status: "completed" }
];

const makeListTaskByUserStub = (): ListTaskByUser => {
  class ListTaskByUserStub implements ListTaskByUser {
    async handle(userId: string): Promise<any[]> {
      return TASKS;
    }
  }
  return new ListTaskByUserStub();
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
  sut: ListTaskByUserController;
  listTaskByUserStub: ListTaskByUser;
  validatorStub: Validator;
}

const makeSut = (): SutTypes => {
  const listTaskByUserStub = makeListTaskByUserStub();
  const validatorStub = makeValidatorStub();
  const sut = new ListTaskByUserController(listTaskByUserStub, validatorStub);

  return { sut, listTaskByUserStub, validatorStub };
};

describe("ListTaskByUserController", () => {
  it("Should call Validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();

    const validateSpy = jest.spyOn(validatorStub, "handle");
    await sut.handle(REQUEST);

    expect(validateSpy).toHaveBeenCalledWith({ id: USER_ID });
  });

  it("Should return 400 if Validator returns isValid false", async () => {
    const { sut, validatorStub } = makeSut();

    jest.spyOn(validatorStub, "handle").mockReturnValue({ isValid: false, message: "Validation error" });
    const response = await sut.handle(REQUEST);

    expect(response).toEqual(badRequest("Validation error"));
  });

  it("Should call ListTaskByUser with correct values", async () => {
    const { sut, listTaskByUserStub } = makeSut();

    const listTaskSpy = jest.spyOn(listTaskByUserStub, "handle");
    await sut.handle(REQUEST);

    expect(listTaskSpy).toHaveBeenCalledWith(USER_ID);
  });

  it("Should return 404 if ListTaskByUser throws 'Usuário não encontrado'", async () => {
    const { sut, listTaskByUserStub } = makeSut();

    jest.spyOn(listTaskByUserStub, "handle").mockRejectedValue(new Error("Usuário não encontrado"));
    const response = await sut.handle(REQUEST);

    expect(response).toEqual(notFound("Usuário não encontrado"));
  });

  it("Should return 500 if ListTaskByUser throws an unexpected error", async () => {
    const { sut, listTaskByUserStub } = makeSut();

    jest.spyOn(listTaskByUserStub, "handle").mockRejectedValue(new Error("Internal error"));
    const response = await sut.handle(REQUEST);

    expect(response).toEqual(internalServerError("Internal error"));
  });

  it("Should return 200 and tasks if successful", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(REQUEST);

    expect(response).toEqual(ok(TASKS));
  });
});
