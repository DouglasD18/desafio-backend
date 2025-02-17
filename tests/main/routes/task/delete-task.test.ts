import request from "supertest";
import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { TaskModel, UserModel } from "@/infra/db/mongoose/schemas";
import app from "@/main/config/app";
import { env } from "@/main/config/env";

const ROUTE = "/api/task/";

describe("Updatetask Route", () => {
  let taskId: string;

  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    
    const user = await UserModel.create({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123!"
    });
    
    taskId = (await TaskModel.create({
      userId: user._id.toString(), 
      title: "valid_title",
      description: "A description",
      status: "pendente"
    }))._id.toString();
  });

  afterAll(async () => {
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  it("should return 400 if id is invalid", async () => {
    const response = await request(app)
      .delete(`${ROUTE}any_id`)

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Id inválido");
  });

  it("should return 404 if id is invalid", async () => {
    const response = await request(app)
      .delete(`${ROUTE}65b172bd7c863c5b7732c559`)

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Tarefa não encontrada");
  });

  it("should return 204 and update the task on success", async () => {
    const task = await TaskModel.findById(taskId);
    expect(task).not.toBeNull();

    const response = await request(app)
      .delete(`${ROUTE}${taskId}`)

    expect(response.statusCode).toBe(204);

    const updatedtask = await TaskModel.findById(taskId);
    expect(updatedtask).toBeNull();
  });
});
