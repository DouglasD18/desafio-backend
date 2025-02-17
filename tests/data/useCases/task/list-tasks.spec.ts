import { ListTasksRepository } from "@/data/protocols/task";
import { ListTasksAdapter } from "@/data/useCases/task";
import { Task, TaskStatus } from "@/domain/models/task";

const Tasks: Task[] = [{
  id: "valid_id",
  userId: "userId",
  title: "valid_titile",
  description: "A description",
  status: TaskStatus.PENDING
}];

const makeListTasksRepositoryStub = (): ListTasksRepository => {
  class ListTasksRepositoryStub implements ListTasksRepository {
    handle(): Promise<Task[]> {
      return new Promise(resolve => resolve(Tasks));
    }
  }

  return new ListTasksRepositoryStub();
};

interface SutTypes {
  sut: ListTasksAdapter;
  listTasksRepositoryStub: ListTasksRepository;
}

const makeSut = (): SutTypes => {
  const listTasksRepositoryStub = makeListTasksRepositoryStub();
  const sut = new ListTasksAdapter(listTasksRepositoryStub);

  return {
    sut,
    listTasksRepositoryStub
  };
};

describe("ListTasksAdapter", () => {
  it("Should call ListTasksRepository ", async () => {
    const { sut, listTasksRepositoryStub } = makeSut();

    const ListTasksSpy = jest.spyOn(listTasksRepositoryStub, "handle");
    await sut.handle();

    expect(ListTasksSpy).toHaveBeenCalled();
  });

  it("Should throw if listTasksRepository throws", async () => {
    const { sut, listTasksRepositoryStub } = makeSut();

    jest.spyOn(listTasksRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.handle();

    expect(promise).rejects.toThrow();
  });

  it("Should return a valid id on success", async () => {
    const { sut } = makeSut();

    const response = await sut.handle();

    expect(response).toEqual(Tasks);
  });
});
