import request from "supertest";

import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { TaskModel } from "@/infra/db/mongoose/schemas";
import { UserModel } from "@/infra/db/mongoose/schemas";
import app from "@/main/config/app";
import { env } from "@/main/config/env";
import { TaskStatus } from "@/domain/models/task";

const ROUTE = "/api/task/";

let userId: string;

const BODY = {
  userId: "",
  title: "Test Task",
  description: "This is a test task description.",
  status: TaskStatus.PENDING
};

describe("CreateTask Route", () => {
  afterAll(async () => {
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  beforeEach(async () => {
    await MongooseHelper.connect(env.mongoUrl);
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    const user = await UserModel.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securePassword123!"
    });
    userId = user._id.toString();
    BODY.userId = userId;
  });

  it("should return 400 if userId is missing", async () => {
    const { title, description, status } = BODY;
    const response = await request(app)
      .post(ROUTE)
      .send({ title, description, status });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if title is missing", async () => {
    const { userId, description, status } = BODY;
    const response = await request(app)
      .post(ROUTE)
      .send({ userId, description, status });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if description is missing", async () => {
    const { userId, title, status } = BODY;
    const response = await request(app)
      .post(ROUTE)
      .send({ userId, title, status });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if status is invalid", async () => {
    const response = await request(app)
      .post(ROUTE)
      .send({
        userId: userId,
        title: "Valid Title",
        description: "Valid description",
        status: "invalid_status"
      });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if title is too short", async () => {
    const response = await request(app)
      .post(ROUTE)
      .send({
        userId: userId,
        title: "ab",
        description: "Valid description",
        status: TaskStatus.PENDING
      });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if description is too short", async () => {
    const response = await request(app)
      .post(ROUTE)
      .send({
        userId: userId,
        title: "Valid Title",
        description: "ab",
        status: TaskStatus.PENDING
      });

    expect(response.statusCode).toBe(400);
  });

  it("should return 404 if userId does not exist", async () => {
    const invalidUserId = "605c72ef1532073f2b8f8b11"; 
    const response = await request(app)
      .post(ROUTE)
      .send({
        userId: invalidUserId,
        title: "Valid Title",
        description: "Valid description",
        status: TaskStatus.PENDING
      });
  
    expect(response.statusCode).toBe(404);
  });

  it("should return 201 and create the task on success", async () => {
    const response = await request(app)
      .post(ROUTE)
      .send(BODY);

    expect(response.statusCode).toBe(201);
    expect(typeof response.body).toEqual("string");
    expect(response.body.length).toBeGreaterThan(0);

    const task = await TaskModel.findById(response.body);
    expect(task).not.toBeNull();
    expect(task?.title).toBe(BODY.title);
    expect(task?.description).toBe(BODY.description);
    expect(task?.status).toBe(BODY.status);
  });
});
