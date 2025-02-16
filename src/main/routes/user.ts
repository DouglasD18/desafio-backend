
import { Router } from "express";
import { expressAdapter } from "../adapters/express";
import { makeCreateUserController, makeListUsersController, makeUpdateUserController } from "../factories/user";

export default (router: Router): void => {
  router.post("/user", expressAdapter(makeCreateUserController()));
  router.get("/user", expressAdapter(makeListUsersController()));
  router.put("/user/:id", expressAdapter(makeUpdateUserController()));
}