
import { Router } from "express";
import { expressAdapter } from "../adapters/express";
import {
  makeCreateTaskController,
  makeUpdateStatusController
} from "../factories/task";

export default (router: Router): void => {
  router.post("/task", expressAdapter(makeCreateTaskController()));
  router.patch("/task/:id", expressAdapter(makeUpdateStatusController()));
}
