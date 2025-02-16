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

describe("UpdateUser Route", () => {
  let userId: string;

  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);
    
    const user = await UserModel.create({
      name: "Old Name",
      email: "old.email@example.com",
      password: "oldPassword123!"
    });
    userId = user._id.toString();
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  it("should return 400 if email is invalid", async () => {
    const response = await request(app)
      .put(`${ROUTE}${userId}`)
      .send({
        email: "invalid-email"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("E-mail inválido");
  });

  it("should return 400 if password is too short", async () => {
    const response = await request(app)
      .put(`${ROUTE}${userId}`)
      .send({
        password: "sH1_ort"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("A senha deve ter pelo menos 8 caracteres");
  });

  it("should return 204 and update the user on success", async () => {
    const response = await request(app)
      .put(`${ROUTE}${userId}`)
      .send(BODY);

    expect(response.statusCode).toBe(204);

    const updatedUser = await UserModel.findById(userId);
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.name).toBe(BODY.name);
    expect(updatedUser?.email).toBe(BODY.email);
  });
});
