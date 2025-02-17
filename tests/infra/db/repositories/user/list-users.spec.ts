import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { ListUsersMongooseRepository } from "@/infra/db/mongoose/repositories/user";
import { UserModel } from "@/infra/db/mongoose/schemas";
import { env } from "@/main/config/env";

describe("ListUsersMongooseRepository", () => {
  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  it("should return an empty array if no users exist", async () => {
    const repository = new ListUsersMongooseRepository();
    
    const users = await repository.handle();
    
    expect(users).toEqual([]);
  });

  it("should return a list of users when users exist", async () => {
    const repository = new ListUsersMongooseRepository();
    await UserModel.create({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123!"
    });

    const users = await repository.handle();
    
    expect(users.length).toBeGreaterThan(0);
    expect(typeof users[0].id).toEqual("string");
    expect(users[0].name).toBe("John Doe");
    expect(users[0].email).toBe("john@example.com");
  });
});
