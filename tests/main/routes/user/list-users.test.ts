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

describe("ListUsers Route", () => {
  afterAll(async () => {
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  beforeEach(async () => {
    await MongooseHelper.connect(env.mongoUrl);
    await UserModel.deleteMany({}); 
  });

  it("should return 200 and an empty array if no users exist", async () => {
    const response = await request(app)
      .get(ROUTE) 
      .expect(200); 

    expect(response.body).toEqual([]);
  });

  it("should return 200 and the correct user data", async () => {
    const createdUser = await UserModel.create(BODY);

    const response = await request(app)
      .get(ROUTE)
      .expect(200); 

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].name).toBe(createdUser.name);
    expect(response.body[0].email).toBe(createdUser.email);
  });
});
