
import { Router } from "express";
import { expressAdapter } from "../adapters/express";
import { makeCreateUserController, makeListUsersController } from "../factories/user";

export default (router: Router): void => {
  router.post("/user", expressAdapter(makeCreateUserController()));
  router.get("/user", expressAdapter(makeListUsersController()));
}