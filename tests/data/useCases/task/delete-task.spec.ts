import { DeleteTaskAdapter } from "@/data/useCases/task";
import { DeleteTaskRepository } from "@/data/protocols/task";

const id = "valid_id";

const makeDeleteTaskRepositoryStub = (): DeleteTaskRepository => {
  class DeleteTaskRepositoryStub implements DeleteTaskRepository {
    async handle(data: string): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }
  return new DeleteTaskRepositoryStub();
};

interface SutTypes {
  sut: DeleteTaskAdapter;
  deleteTaskRepositoryStub: DeleteTaskRepository;
}

const makeSut = (): SutTypes => {
  const deleteTaskRepositoryStub = makeDeleteTaskRepositoryStub();
  const sut = new DeleteTaskAdapter(deleteTaskRepositoryStub);
  return {
    sut,
    deleteTaskRepositoryStub,
  };
};

describe("DeleteTaskAdapter", () => {
  it("should call DeleteTaskRepository if the Task is found", async () => {
    const { sut, deleteTaskRepositoryStub } = makeSut();

    const DeleteTaskSpy = jest.spyOn(deleteTaskRepositoryStub, "handle");
    await sut.handle(id);

    expect(DeleteTaskSpy).toHaveBeenCalledWith(id);
  });

  it("should throw an error if DeleteTaskRepository throws", async () => {
    const { sut, deleteTaskRepositoryStub } = makeSut();

    jest.spyOn(deleteTaskRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.handle(id);

    expect(promise).rejects.toThrow();
  });

  it("should return false if DeleteTaskRepository returns false", async () => {
    const { sut, deleteTaskRepositoryStub } = makeSut();

    jest.spyOn(deleteTaskRepositoryStub, "handle").mockImplementationOnce(() => {
      return new Promise(resolve => resolve(false));
    });
    const result = await sut.handle(id);

    expect(result).toEqual(false);
  });

  it("should return true on success", async () => {
    const { sut } = makeSut();

    const result = await sut.handle(id);

    expect(result).toEqual(true); 
  });
});
