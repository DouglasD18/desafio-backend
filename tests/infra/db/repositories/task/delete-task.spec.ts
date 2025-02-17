import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { DeleteTaskMongooseRepository } from "@/infra/db/mongoose/repositories/task";
import { TaskModel, UserModel } from "@/infra/db/mongoose/schemas";
import { env } from "@/main/config/env";

let taskId: string;

describe("DeleteTaskMongooseRepository", () => {
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
    await MongooseHelper.disconnect();
  });

  it("should Delete the Task", async () => {
    const repository = new DeleteTaskMongooseRepository();

    const task = await TaskModel.findById(taskId);
    const result = await repository.handle(taskId);
    const deletedTask = await TaskModel.findById(taskId);

    expect(task).not.toBeNull();
    expect(result).toBe(true);
    expect(deletedTask).toBeNull();
  });

  it("should return false if Task does not exists", async () => {
    const repository = new DeleteTaskMongooseRepository();

    const result = await repository.handle("65b172bd7c863c5b7732c559");

    expect(result).toBe(false);
  });
});
