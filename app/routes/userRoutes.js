import Router from "express";
import createUserController from "../controllers/createUsers.js";
import loginController from "../controllers/login.js";

const router = Router();

router.post("/create", createUserController);

router.post("/login", loginController);

export default router;
