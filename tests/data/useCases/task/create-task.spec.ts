import { CreateTaskRepository } from "@/data/protocols/task";
import { CreateTaskAdapter } from "@/data/useCases/task";
import { CreateTaskPayload, CreateTaskResponse, TaskStatus } from "@/domain/models/task";

const id = "valid_id";

const CREATE_TASK_RESPONSE: CreateTaskResponse = {
  id
};

const PAYLOAD: CreateTaskPayload = {
  userId: "userId",
  title: "valid_titile",
  description: "A description",
  status: TaskStatus.PENDING
};

const makeCreateTaskRepositoryStub = (): CreateTaskRepository => {
  class CreateTaskRepositoryStub implements CreateTaskRepository {
    handle(data: CreateTaskPayload): Promise<string> {
      return new Promise(resolve => resolve(id));
    }
  }

  return new CreateTaskRepositoryStub();
};

interface SutTypes {
  sut: CreateTaskAdapter;
  createTaskRepositoryStub: CreateTaskRepository;
}

const makeSut = (): SutTypes => {
  const createTaskRepositoryStub = makeCreateTaskRepositoryStub();
  const sut = new CreateTaskAdapter(createTaskRepositoryStub);

  return {
    sut,
    createTaskRepositoryStub
  };
};

describe("CreateTaskAdapter", () => {
  it("Should call CreateTaskRepository with correct values", async () => {
    const { sut, createTaskRepositoryStub } = makeSut();

    const createTaskSpy = jest.spyOn(createTaskRepositoryStub, "handle");
    await sut.handle(PAYLOAD);

    expect(createTaskSpy).toHaveBeenCalledWith(PAYLOAD);
  });

  it("Should throw if CreateTaskRepository throws", async () => {
    const { sut, createTaskRepositoryStub } = makeSut();

    jest.spyOn(createTaskRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.handle(PAYLOAD);

    expect(promise).rejects.toThrow();
  });

  it("Should return a valid id on success", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(PAYLOAD);

    expect(response).toEqual(CREATE_TASK_RESPONSE);
  });
});
