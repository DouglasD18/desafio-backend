import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { env } from "@/main/config/env";
import mongoose from "mongoose";

describe("MongooseHelper", () => {
  const testMongoUri = env.mongoUrl;

  afterAll(async () => {
    await MongooseHelper.disconnect();
  });

  it("should connect to MongoDB without errors", async () => {
    await expect(MongooseHelper.connect(testMongoUri)).resolves.not.toThrow();
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("should disconnect from MongoDB without errors", async () => {
    await MongooseHelper.disconnect();
    expect(mongoose.connection.readyState).toBe(0);
  });

  it("should throw an error if connection fails", async () => {
    jest.spyOn(mongoose, "connect").mockRejectedValueOnce(new Error("Connection failed"));

    await expect(MongooseHelper.connect("invalid_uri")).rejects.toThrow("Connection failed");
  });

  it("should throw an error if disconnection fails", async () => {
    jest.spyOn(mongoose, "disconnect").mockRejectedValueOnce(new Error("Disconnection failed"));

    await expect(MongooseHelper.disconnect()).rejects.toThrow("Disconnection failed");
  });
});
