import Router from "express";
import createUserController from "../controllers/createUsers.js";
import loginController from "../controllers/login.js";
import logoutController from "../controllers/logout.js";
import verifyLogin from "../controllers/verifyLogin.js";
import verifySession from "../controllers/verifySession.js";

const router = Router();

router.post("/create", createUserController);

router.post("/login", loginController);

router.post("/logout", logoutController);

router.get("/verify", verifyLogin);

router.get("/session", verifySession);

export default router;
