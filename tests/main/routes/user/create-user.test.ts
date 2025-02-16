import request from "supertest";

import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { UserModel } from "@/infra/db/mongoose/schemas";
import app from "@/main/config/app";
import { env } from "@/main/config/env";

const ROUTE = "/api/user/";

const BODY = {
  name: "John Doe",
  email: "john@example.com",
  password: "securePassword123!"
};

describe("CreateUser Route", () => {
  afterAll(async () => { 
    await UserModel.deleteMany({}); 
    await MongooseHelper.disconnect(); 
  });

  beforeEach(async () => {
    await MongooseHelper.connect(env.mongoUrl); 
    await UserModel.deleteMany({}); 
  });

  it("should return 400 if name is missing", async () => {
    const { email, password } = BODY;
    const response = await request(app)
      .post(ROUTE)
      .send({ email, password });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if email is missing", async () => {
    const { name, password } = BODY;
    const response = await request(app)
      .post(ROUTE)
      .send({ name, password });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if password is missing", async () => {
    const { name, email } = BODY;
    const response = await request(app)
      .post(ROUTE)
      .send({ name, email });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if email is invalid", async () => {
    const response = await request(app)
      .post(ROUTE)
      .send({
        name: "John Doe",
        email: "invalid-email",
        password: "securePassword123!"
      });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if password is too short", async () => {
    const response = await request(app)
      .post(ROUTE)
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "short"
      });

    expect(response.statusCode).toBe(400);
  });

  it("should return 201 and create the user on success", async () => {
    const response = await request(app)
      .post(ROUTE)
      .send(BODY);

    expect(response.statusCode).toBe(201);
    expect(typeof response.body).toEqual("string");
    expect(response.body.length).toBeGreaterThan(0);

    const user = await UserModel.findOne({ email: BODY.email });
    expect(user).not.toBeNull();
  });
});
