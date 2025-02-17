import request from "supertest";

import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { TaskModel, UserModel } from "@/infra/db/mongoose/schemas";
import app from "@/main/config/app";
import { env } from "@/main/config/env";

const ROUTE = "/api/user/";

let userId: string;
let taskId: string;

describe("ListTasksByUserController", () => {
  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  beforeEach(async () => {
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});

    const user = await UserModel.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securePassword123!",
    });

    userId = user._id.toString();

    const task = await TaskModel.create({
      userId,
      title: "Test Task",
      description: "This is a test task description.",
      status: "pendente",
    });

    taskId = task._id.toString();
  });

  it("should return 200 and list tasks for the given user", async () => {
    const response = await request(app)
      .get(`${ROUTE}${userId}/tasks`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1); 
    expect(response.body[0]).toHaveProperty("id", taskId);
    expect(response.body[0]).toHaveProperty("status", "pendente");
  });

  it("should return 200 if user has no tasks", async () => {
    const userWithoutTasks = await UserModel.create({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "securePassword123!",
    });

    const response = await request(app)
      .get(`${ROUTE}${userWithoutTasks._id.toString()}/tasks`);

    expect(response.statusCode).toBe(200); 
  });

  it("should return 400 if userId is invalid", async () => {
    const response = await request(app)
      .get(`${ROUTE}idInvalid/tasks`);

    expect(response.statusCode).toBe(400); 
    expect(response.body).toEqual({ message: "Id inválido" });
  });

  it("should return 404 if user does not exist", async () => {
    const response = await request(app)
      .get(`${ROUTE}65b172bd7c863c5b7732c559/tasks`);

    expect(response.statusCode).toBe(404); 
    expect(response.body).toEqual({ message: "Usuário não encontrado" });
  });
});
