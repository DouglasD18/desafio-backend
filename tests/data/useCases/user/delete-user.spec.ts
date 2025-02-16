import { DeleteUserAdapter } from "@/data/useCases/user";
import { DeleteUserRepository } from "@/data/protocols/user";

const id = "valid_id";

const makeDeleteUserRepositoryStub = (): DeleteUserRepository => {
  class DeleteUserRepositoryStub implements DeleteUserRepository {
    async handle(data: string): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }
  return new DeleteUserRepositoryStub();
};

interface SutTypes {
  sut: DeleteUserAdapter;
  deleteUserRepositoryStub: DeleteUserRepository;
}

const makeSut = (): SutTypes => {
  const deleteUserRepositoryStub = makeDeleteUserRepositoryStub();
  const sut = new DeleteUserAdapter(deleteUserRepositoryStub);
  return {
    sut,
    deleteUserRepositoryStub,
  };
};

describe("DeleteUserAdapter", () => {
  it("should call DeleteUserRepository if the user is found", async () => {
    const { sut, deleteUserRepositoryStub } = makeSut();

    const DeleteUserSpy = jest.spyOn(deleteUserRepositoryStub, "handle");
    await sut.handle(id);

    expect(DeleteUserSpy).toHaveBeenCalledWith(id);
  });

  it("should throw an error if DeleteUserRepository throws", async () => {
    const { sut, deleteUserRepositoryStub } = makeSut();

    jest.spyOn(deleteUserRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.handle(id);

    expect(promise).rejects.toThrow();
  });

  it("should return false if DeleteUserRepository returns false", async () => {
    const { sut, deleteUserRepositoryStub } = makeSut();

    jest.spyOn(deleteUserRepositoryStub, "handle").mockImplementationOnce(() => {
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
