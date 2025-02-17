import { ListTasksByUserAdapter } from "@/data/useCases/user";
import { ListTasksByUserRepository } from "@/data/protocols/task";
import { ListUserByIdRepository } from "@/data/protocols/user";

const USER_ID = "any_user_id";
const TASKS = [
  { id: "task_1", title: "Task 1", description: "Desc 1", status: "pending" },
  { id: "task_2", title: "Task 2", description: "Desc 2", status: "completed" }
];
const USER = { id: USER_ID, name: "Any User" };

const makeListTasksByUserRepositoryStub = (): ListTasksByUserRepository => {
  class ListTasksByUserRepositoryStub implements ListTasksByUserRepository {
    async handle(userId: string): Promise<any[]> {
      return TASKS;
    }
  }
  return new ListTasksByUserRepositoryStub();
};

const makeListUserByIdRepositoryStub = (): ListUserByIdRepository => {
  class ListUserByIdRepositoryStub implements ListUserByIdRepository {
    async handle(userId: string): Promise<any | null> {
      return USER;
    }
  }
  return new ListUserByIdRepositoryStub();
};

interface SutTypes {
  sut: ListTasksByUserAdapter;
  listTasksByUserRepositoryStub: ListTasksByUserRepository;
  listUserByIdRepositoryStub: ListUserByIdRepository;
}

const makeSut = (): SutTypes => {
  const listTasksByUserRepositoryStub = makeListTasksByUserRepositoryStub();
  const listUserByIdRepositoryStub = makeListUserByIdRepositoryStub();
  const sut = new ListTasksByUserAdapter(listTasksByUserRepositoryStub, listUserByIdRepositoryStub);

  return { sut, listTasksByUserRepositoryStub, listUserByIdRepositoryStub };
};

describe("ListTasksByUserAdapter", () => {
  it("Should call ListUserByIdRepository with correct values", async () => {
    const { sut, listUserByIdRepositoryStub } = makeSut();

    const findUserSpy = jest.spyOn(listUserByIdRepositoryStub, "handle");
    await sut.handle(USER_ID);

    expect(findUserSpy).toHaveBeenCalledWith(USER_ID);
  });

  it("Should throw an error if ListUserByIdRepository returns null", async () => {
    const { sut, listUserByIdRepositoryStub } = makeSut();

    jest.spyOn(listUserByIdRepositoryStub, "handle").mockResolvedValue(null);

    await expect(sut.handle(USER_ID)).rejects.toThrow("Usuário não encontrado");
  });

  it("Should call ListTasksByUserRepository with correct values", async () => {
    const { sut, listTasksByUserRepositoryStub } = makeSut();

    const listTasksSpy = jest.spyOn(listTasksByUserRepositoryStub, "handle");
    await sut.handle(USER_ID);

    expect(listTasksSpy).toHaveBeenCalledWith(USER_ID);
  });
    
  it("Should throw if ListUserByIdRepository throws", async () => {
    const { sut, listUserByIdRepositoryStub } = makeSut();
    
    jest.spyOn(listUserByIdRepositoryStub, "handle").mockRejectedValue(new Error("Internal error"));
    
    await expect(sut.handle(USER_ID)).rejects.toThrow("Internal error");
  });
  
  it("Should throw if ListTasksByUserRepository throws", async () => {
    const { sut, listTasksByUserRepositoryStub } = makeSut();
    
    jest.spyOn(listTasksByUserRepositoryStub, "handle").mockRejectedValue(new Error("Internal error"));
    
    await expect(sut.handle(USER_ID)).rejects.toThrow("Internal error");
  });

  it("Should return tasks if ListTasksByUserRepository succeeds", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(USER_ID);

    expect(response).toEqual(TASKS);
  });
});
