import request from "supertest";
import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { UserModel } from "@/infra/db/mongoose/schemas";
import app from "@/main/config/app";
import { env } from "@/main/config/env";

const ROUTE = "/api/user/";

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
    expect(response.body.message).toBe("Usuário não encontrado");
  });

  it("should return 204 and update the user on success", async () => {
    const user = await UserModel.findById(userId);
    expect(user).not.toBeNull();

    const response = await request(app)
      .delete(`${ROUTE}${userId}`)

    expect(response.statusCode).toBe(204);

    const updatedUser = await UserModel.findById(userId);
    expect(updatedUser).toBeNull();
  });
});
