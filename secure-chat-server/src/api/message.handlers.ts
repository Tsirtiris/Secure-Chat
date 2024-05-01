import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../routes/route.types";
import prisma from "../utils/prisma.config";
import MessageController from "../controllers/message.controller";
import { CustomError } from "../middleware/error.middleware";
import { StatusCodes } from "http-status-codes";

const getMessages = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		if (!id) {
			throw new CustomError({
				message: "Contact id is required",
				statusCode: StatusCodes.BAD_REQUEST,
			});
		}

		const userId = req.userId;
		if (!userId) {
			throw new CustomError({
				message: "Unauthorized, login again.",
				statusCode: StatusCodes.UNAUTHORIZED,
			});
		}
		const messages = await MessageController.getMessages(userId, id);
		return res.status(StatusCodes.OK).json(messages);
	} catch (error) {
		next(error);
	}
};

const MessageHandler = {
	getMessages,
};

export default MessageHandler;
