import { NextFunction, Request, Response } from "express";
import { loginSchema, userSchema } from "./user.schema";
import UserController from "../controllers/user.controller";
import { signJWT } from "../middleware/auth.middleware";
import { RequestWithUser } from "../routes/route.types";
import getServerKeys from "../utils/keys.config";

const registerHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const body: typeof userSchema.__outputType = req.body;
		await userSchema.validate(body);
		const user = await UserController.register(body);
		const token = await signJWT(user.id);
		return res.json({ user, token });
	} catch (error) {
		next(error);
	}
};

const loginHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const body: typeof loginSchema.__outputType = req.body;
		await loginSchema.validate(body);
		const user = await UserController.login(body);
		const token = await signJWT(user.id);
		return res.json({ user, token });
	} catch (error) {
		next(error);
	}
};

const currentUserHandler = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.userId ?? "";
		const user = await UserController.currentUser({ id });
		return res.json({ user });
	} catch (error) {
		next(error);
	}
};

const UserHandlers = {
	registerHandler,
	loginHandler,
	currentUserHandler,
};

export default UserHandlers;
