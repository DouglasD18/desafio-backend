import { MongooseHelper } from "@/infra/db/mongoose/mongoose-helper";
import { UpdateStatusMongooseRepository } from "@/infra/db/mongoose/repositories/task";
import { TaskModel, UserModel } from "@/infra/db/mongoose/schemas";
import { TaskStatus } from "@/domain/models/task";
import { env } from "@/main/config/env";

let taskId: string;

describe("UpdateStatusMongooseRepository", () => {
  beforeAll(async () => {
    await MongooseHelper.connect(env.mongoUrl);
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    
    const user = await UserModel.create({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123!"
    });

    const task = await TaskModel.create({
      userId: user._id.toString(),
      title: "Task Title",
      description: "A task description",
      status: TaskStatus.PENDING
    });

    taskId = task._id.toString();
  });

  afterAll(async () => {
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    await MongooseHelper.disconnect();
  });

  it("should update the status of the task", async () => {
    const repository = new UpdateStatusMongooseRepository();

    const newStatus = TaskStatus.IN_PROGRESS;

    const result = await repository.handle({
      id: taskId, 
      status: newStatus, 
    });

    const updatedTask = await TaskModel.findById(taskId);

    expect(result).toBe(true);
    expect(updatedTask).toBeDefined();
    expect(updatedTask?.status).toBe(newStatus); 
  });

  it("should return false if task does not exist", async () => {
    const repository = new UpdateStatusMongooseRepository();

    const result = await repository.handle({
      id: "65b172bd7c863c5b7732c559",
      status: TaskStatus.COMPLETED,
    });

    expect(result).toBe(false);
  });
});
