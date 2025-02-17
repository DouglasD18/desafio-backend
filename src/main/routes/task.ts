
import { Router } from "express";
import { expressAdapter } from "../adapters/express";
import {
  makeCreateTaskController,
  makeUpdateStatusController,
  makeListTasksController,
  makeDeleteTaskController
} from "../factories/task";

export default (router: Router): void => {
  router.post("/task", expressAdapter(makeCreateTaskController()));
  router.patch("/task/:id", expressAdapter(makeUpdateStatusController()));
  router.get("/task", expressAdapter(makeListTasksController()));
  router.delete("/task/:id", expressAdapter(makeDeleteTaskController()));
}
