import request from "supertest";
import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { TaskModel, UserModel } from "@/infra/db/mongoose/schemas";
import app from "@/main/config/app";
import { env } from "@/main/config/env";

const ROUTE = "/api/task/";
let userId: string;

const BODY = {
  name: "John Doe",
  email: "john@example.com",
  password: "securePassword123!"
};

describe("ListTasks Route", () => {
  afterAll(async () => {
    await TaskModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

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

  it("should return 200 and an empty array if no tasks exist", async () => {
    await TaskModel.deleteMany({});
    const response = await request(app)
      .get(ROUTE) 
      .expect(200); 

    expect(response.body).toEqual([]);
  });

  it("should return 200 and the correct task data", async () => {
    await TaskModel.create({
      userId,
      title: "Task 1",
      description: "Description 1",
      status: "pendente"
    });
    await TaskModel.create({
      userId,
      title: "Task 2",
      description: "Description 2",
      status: "em progresso"
    });
  
    const response = await request(app)
      .get(ROUTE)
      .expect(200);
  
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].title).toBe("Task 1");
    expect(response.body[1].title).toBe("Task 2");
  });  
});
