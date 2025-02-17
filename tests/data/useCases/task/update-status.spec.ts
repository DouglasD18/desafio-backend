import { UpdateStatusAdapter } from "@/data/useCases/task";
import { UpdateStatusRepository } from "@/data/protocols/task";
import { UpdateStatusPayload, TaskStatus } from "@/domain/models/task";

const PAYLOAD = {
  id: "valid_id",
  status: TaskStatus.PENDING
}

const makeUpdateStatusRepositoryStub = (): UpdateStatusRepository => {
  class UpdateStatusRepositoryStub implements UpdateStatusRepository {
    async handle(data: UpdateStatusPayload): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }
  return new UpdateStatusRepositoryStub();
};

interface SutTypes {
  sut: UpdateStatusAdapter;
  updateStatusRepositoryStub: UpdateStatusRepository;
}

const makeSut = (): SutTypes => {
  const updateStatusRepositoryStub = makeUpdateStatusRepositoryStub();
  const sut = new UpdateStatusAdapter(updateStatusRepositoryStub);
  return {
    sut,
    updateStatusRepositoryStub,
  };
};

describe("UpdateStatusAdapter", () => {
  it("should call UpdateStatusRepository if the Status is found", async () => {
    const { sut, updateStatusRepositoryStub } = makeSut();

    const updateStatusSpy = jest.spyOn(updateStatusRepositoryStub, "handle");
    await sut.handle(PAYLOAD);

    expect(updateStatusSpy).toHaveBeenCalledWith(PAYLOAD);
  });

  it("should throw an error if UpdateStatusRepository throws", async () => {
    const { sut, updateStatusRepositoryStub } = makeSut();

    jest.spyOn(updateStatusRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.handle(PAYLOAD);

    expect(promise).rejects.toThrow();
  });

  it("should return false if UpdateStatusRepository returns false", async () => {
    const { sut, updateStatusRepositoryStub } = makeSut();

    jest.spyOn(updateStatusRepositoryStub, "handle").mockImplementationOnce(() => {
      return new Promise(resolve => resolve(false));
    });
    const result = await sut.handle(PAYLOAD);

    expect(result).toEqual(false);
  });

  it("should return true on success", async () => {
    const { sut } = makeSut();

    const result = await sut.handle(PAYLOAD);

    expect(result).toEqual(true); 
  });
});
