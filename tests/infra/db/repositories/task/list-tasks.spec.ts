import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { ListTasksMongooseRepository } from "@/infra/db/mongoose/repositories/task";
import { TaskModel, UserModel } from "@/infra/db/mongoose/schemas";
import { Task } from "@/domain/models/task";
import { env } from "@/main/config/env";

let userId: string;

const makeSut = (): ListTasksMongooseRepository => {
  return new ListTasksMongooseRepository();
};

describe("ListTasksMongooseRepository", () => {
  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});

    const user = await UserModel.create({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123!"
    });

    userId = user._id.toString();
  });

  afterAll(async () => {
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  it("should return all tasks", async () => {
    const sut = makeSut();

    await TaskModel.create([
      {
        userId,
        title: "Task 1",
        description: "Description 1",
        status: "pendente"
      },
      {
        userId,
        title: "Task 2",
        description: "Description 2",
        status: "em_progresso"
      }
    ]);

    const tasks: Task[] = await sut.handle();

    expect(tasks).toHaveLength(2);
    expect(tasks[0]).toMatchObject({
      id: expect.any(String),
      title: "Task 1",
      description: "Description 1",
      status: "pendente"
    });
    expect(tasks[1]).toMatchObject({
      id: expect.any(String),
      title: "Task 2",
      description: "Description 2",
      status: "em_progresso"
    });
  });

  it("should return an empty array if has no tasks", async () => {
    await TaskModel.deleteMany({});
    const sut = makeSut();
    
    const tasks = await sut.handle(); 

    expect(tasks).toEqual([]);
  });

  it("should throw an error if database operation fails", async () => {
    const sut = makeSut();

    jest.spyOn(TaskModel, "find").mockRejectedValue(new Error("Database error"));

    await expect(sut.handle()).rejects.toThrow("Database error");
  });
});
