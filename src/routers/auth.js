import Router from "express";
import { registerUserController,loginUserController, logoutUserController, refreshTokenController } from "../controllers/auth.js";
import { ctrlWrapper } from "./contacts.js";
import { validateBody } from "../controllers/contacts.js";
import { loginUserSchema, registerUserSchema } from "../validation/auth.js";
const authRouter = Router();
authRouter.post('/register',validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
authRouter.post('/logout',ctrlWrapper(logoutUserController));
authRouter.post('/refresh', ctrlWrapper(refreshTokenController));

export default authRouter;