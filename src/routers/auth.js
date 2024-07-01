import Router from "express";
import { registerUserController,loginUserController, logoutUserController, refreshTokenController, sendResetEmailController, resetPasswordController } from "../controllers/auth.js";
import { ctrlWrapper } from "./contacts.js";
import { validateBody } from "../controllers/contacts.js";
import { loginUserSchema, registerUserSchema, requestResetEmailSchema, resetPasswordSchema } from "../validation/auth.js";
const authRouter = Router();
authRouter.post('/register',validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
authRouter.post('/logout',ctrlWrapper(logoutUserController));
authRouter.post('/refresh', ctrlWrapper(refreshTokenController));
authRouter.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(sendResetEmailController));
authRouter.post('/reset-pwd',validateBody(resetPasswordSchema) , ctrlWrapper(resetPasswordController));

export default authRouter;