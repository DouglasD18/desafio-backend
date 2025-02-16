import { CreateTaskController } from "@/presentation/controllers/task/create-task";
import { CreateTask } from "@/domain/useCases/task";
import { ListUserById, Validator } from "@/domain/useCases/user";
import { HttpRequest } from "@/presentation/protocols";
import { badRequest, created, internalServerError, notFound } from "@/presentation/helpers/http";
import { TaskStatus, CreateTaskResponse } from "@/domain/models/task";
import { Validated, User } from "@/domain/models/user";

const VALIDATED: Validated = { isValid: true };
const TASK_ID = "any_task_id";
const USER_ID = "any_user_id";

const USER: User = {
  id: USER_ID,
  name: "any_name",
  email: "any_email"
};

const REQUEST: HttpRequest = {
  body: {
    title: "Task Test",
    description: "Task description",
    status: TaskStatus.PENDING,
    userId: USER_ID
  }
};

const makeCreateTaskStub = (): CreateTask => {
  class CreateTaskStub implements CreateTask {
    async handle(): Promise<CreateTaskResponse> {
      return { id: TASK_ID };
    }
  }
  return new CreateTaskStub();
};

const makeListUserByIdStub = (): ListUserById => {
  class ListUserByIdStub implements ListUserById {
    async handle(): Promise<User> {
      return USER;
    }
  }
  return new ListUserByIdStub();
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
  sut: CreateTaskController;
  createTaskStub: CreateTask;
  listUserByIdStub: ListUserById;
  validatorStub: Validator;
}

const makeSut = (): SutTypes => {
  const createTaskStub = makeCreateTaskStub();
  const listUserByIdStub = makeListUserByIdStub();
  const validatorStub = makeValidatorStub();
  const sut = new CreateTaskController(createTaskStub, validatorStub, listUserByIdStub);

  return { sut, createTaskStub, listUserByIdStub, validatorStub };
};

describe("CreateTaskController", () => {
  it("Should call Validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();

    const validateSpy = jest.spyOn(validatorStub, "handle");
    await sut.handle(REQUEST);

    expect(validateSpy).toHaveBeenCalledWith({ ...REQUEST.body, userId: USER_ID });
  });

  it("Should return 400 if Validator returns isValid false", async () => {
    const { sut, validatorStub } = makeSut();

    jest.spyOn(validatorStub, "handle").mockReturnValue({ isValid: false, message: "Validation error" });
    const response = await sut.handle(REQUEST);

    expect(response).toEqual(badRequest("Validation error"));
  });

  it("Should call ListUserById with correct userId", async () => {
    const { sut, listUserByIdStub } = makeSut();

    const listUserSpy = jest.spyOn(listUserByIdStub, "handle");
    await sut.handle(REQUEST);

    expect(listUserSpy).toHaveBeenCalledWith(USER_ID);
  });

  it("Should return 404 if ListUserById does not find the user", async () => {
    const { sut, listUserByIdStub } = makeSut();

    jest.spyOn(listUserByIdStub, "handle").mockResolvedValue(null);
    const response = await sut.handle(REQUEST);

    expect(response).toEqual(notFound("Usuário não encontrado"));
  });

  it("Should call CreateTask with correct values", async () => {
    const { sut, createTaskStub } = makeSut();

    const createTaskSpy = jest.spyOn(createTaskStub, "handle");
    await sut.handle(REQUEST);

    expect(createTaskSpy).toHaveBeenCalledWith({ ...REQUEST.body, userId: USER_ID });
  });

  it("Should return 500 if CreateTask throws", async () => {
    const { sut, createTaskStub } = makeSut();

    jest.spyOn(createTaskStub, "handle").mockImplementation(() => {
      throw new Error("Internal error");
    });
    const response = await sut.handle(REQUEST);

    expect(response).toEqual(internalServerError("Internal error"));
  });

  it("Should return 201 and task ID if successful", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(REQUEST);

    expect(response).toEqual(created(TASK_ID));
  });
});
