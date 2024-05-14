import { NextFunction, Request, Response } from "express";
import { RequestWithFile, RequestWithUser } from "../routes/route.types";
import prisma from "../utils/prisma.config";
import MessageController from "../controllers/message.controller";
import { CustomError } from "../middleware/error.middleware";
import { StatusCodes } from "http-status-codes";
import { getEncryptedFile, saveEncryptedFile } from "../utils/encryption";
import path from "path";
import crypto from "crypto";
import { Stream } from "stream";
import * as yup from "yup";
import { Scope, Type } from "@prisma/client";
import SocketKeys from "../interfaces/socket.types";
import GroupController from "../controllers/group.controller";
import _ from "lodash";

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

const uploadFile = async (
	req: RequestWithFile,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId ?? "";
		const bodyValidator = yup.object().shape({
			mode: yup.string().required().oneOf([Scope.GROUP, Scope.PERSONAL]),
			receiverId: yup.string().required(),
			tempId: yup.string().required(),
		});
		const body: typeof bodyValidator.__outputType = req.body;
		await bodyValidator.validate(body);

		const file = req.file;
		if (!file) {
			throw new CustomError({
				message: "file not found",
				statusCode: StatusCodes.NOT_FOUND,
			});
		}

		const random_filename =
			crypto.randomBytes(12).toString("hex") +
			path.extname(file.originalname);
		const pathName = path.join("files/", random_filename);

		const { encryptedFile, encryptedKey } = saveEncryptedFile(
			file.buffer,
			pathName
		);
		const newMessage = await MessageController.addMessage({
			key: encryptedKey,
			message: "",
			mode: body.mode,
			receiverId: body.receiverId,
			userId,
			type: Type.FILE,
			file: {
				mimeType: file.mimetype,
				filename: random_filename,
				originalName: file.originalname,
				size: file.size,
			},
		});

		return res.json(_.omit(newMessage, ["sender", "receiver", "key"]));
	} catch (error) {
		next(error);
	}
};

const getFile = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId ?? "";
		let id = req.params["id"];
		if (!id) {
			throw new CustomError({
				message: "Message ID Not Found",
				statusCode: StatusCodes.BAD_REQUEST,
			});
		}

		const message = await MessageController.getMessageById(id);

		if (!message || !message.file) {
			throw new CustomError({
				message: "File not found",
				statusCode: StatusCodes.BAD_REQUEST,
			});
		}

		if (
			message.scope == Scope.PERSONAL &&
			message.receiver_id !== userId &&
			message.sender_id !== userId
		) {
			throw new CustomError({
				message: "You're not authorized to access this file",
				statusCode: StatusCodes.UNAUTHORIZED,
			});
		} else if (message.scope == Scope.GROUP && message.group_id) {
			const members = (
				await GroupController.getMembers(message.group_id)
			).map((member) => member.id);

			if (!members.includes(userId)) {
				throw new CustomError({
					message: "You're not authorized to access this file",
					statusCode: StatusCodes.UNAUTHORIZED,
				});
			}
		}

		let filename = path.join("files/", message.file.filename);
		let buffer = getEncryptedFile(filename, message.key);
		const readStream = new Stream.PassThrough();
		readStream.end(buffer);
		res.writeHead(200, {
			"Content-disposition":
				"attachment; filename=" + message.file.originalName,
			"Content-Type": "application/octet-stream",
			"Content-Length": buffer.length,
		});
		res.end(buffer);
	} catch (error) {
		next(error);
	}
};

const MessageHandler = {
	getMessages,
	uploadFile,
	getFile,
};

export default MessageHandler;
