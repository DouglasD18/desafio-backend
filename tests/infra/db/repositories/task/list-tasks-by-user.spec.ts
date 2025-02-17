import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { ListTaskByIdMongooseRepository } from "@/infra/db/mongoose/repositories/task";
import { TaskModel, UserModel } from "@/infra/db/mongoose/schemas";
import { TaskByUser } from "@/domain/models/task";
import { env } from "@/main/config/env";

let userId: string;

const makeSut = (): ListTaskByIdMongooseRepository => {
  return new ListTaskByIdMongooseRepository();
};

describe("ListTaskByIdMongooseRepository", () => {
  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);

    const user = await UserModel.create({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123!"
    });

    userId = user._id.toString();

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
  });

  afterAll(async () => {
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  it("should return all tasks for a given user", async () => {
    const sut = makeSut();

    const tasks: TaskByUser[] = await sut.handle(userId);

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

  it("should return an empty array if user has no tasks", async () => {
    const sut = makeSut();
    
    const tasks = await sut.handle("65b172bd7c863c5b7732c559"); // ID inexistente

    expect(tasks).toEqual([]);
  });

  it("should throw an error if database operation fails", async () => {
    const sut = makeSut();

    jest.spyOn(TaskModel, "find").mockRejectedValue(new Error("Database error"));

    await expect(sut.handle(userId)).rejects.toThrow("Database error");
  });
});
