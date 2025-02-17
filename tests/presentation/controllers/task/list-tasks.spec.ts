import { Task, TaskStatus } from "@/domain/models/task";
import { ListTasks } from "@/domain/useCases/task";
import { ListTasksController } from "@/presentation/controllers/task/list-tasks";
import { InternalServerError } from "@/presentation/errors";
import { HttpRequest } from "@/presentation/protocols";

const _httpResponse: HttpRequest = {}

const Tasks: Task[] = [{
  id: "any_id",
  title: "Task Test",
  description: "Task description",
  status: TaskStatus.PENDING,
  userId: "any_user_id"
}]

interface SutTypes {
  sut: ListTasksController
  listTasksStub: ListTasks
}

const makeListTasksStub = (): ListTasks => {
  class ListTasksStub implements ListTasks {
    handle(): Promise<Task[]> {
      return new Promise(resolve => resolve(Tasks));
    }
  }

  return new ListTasksStub();
}

const makeSut = (): SutTypes => {
  const listTasksStub = makeListTasksStub();
  const sut = new ListTasksController(listTasksStub);

  return {
    sut,
    listTasksStub
  }
}

describe('ListTasksController', () => {
  it("Should call ListTasks", async () => {
    const { sut, listTasksStub } = makeSut();

    const ListTasksSpy = jest.spyOn(listTasksStub, "handle");
    await sut.handle(_httpResponse);

    expect(ListTasksSpy).toHaveBeenCalled();
  });

  it('Should return 500 if ListTasks throws', async () => {
    const { sut, listTasksStub } = makeSut();

    jest.spyOn(listTasksStub, "handle").mockImplementation(() => {
      throw new Error("Erro interno");
    })
    const httpResponse = await sut.handle(_httpResponse);

    expect(httpResponse.body).toEqual(new InternalServerError("Erro interno"));
    expect(httpResponse.statusCode).toBe(500);
  });

  it('Should return 200 when work right.', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(_httpResponse);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(Tasks);
  });
});