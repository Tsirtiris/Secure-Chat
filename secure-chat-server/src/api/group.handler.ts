import { NextFunction, Response } from "express";
import { RequestWithUser } from "../routes/route.types";
import { CustomError } from "../middleware/error.middleware";
import { createGroupSchema } from "./group.schema";
import GroupController from "../controllers/group.controller";
import { ValidationError } from "yup";
import { StatusCodes } from "http-status-codes";
import UserController from "../controllers/user.controller";
import MessageController from "../controllers/message.controller";
import _ from "lodash";

const createGroup = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId ?? "";
		const body: typeof createGroupSchema.__outputType = req.body;
		await createGroupSchema.validate(body);
		const group = await GroupController.createGroup({ userId, ...body });
		return res
			.status(200)
			.json({ msg: "Group created successfully", data: group });
	} catch (err) {
		next(err);
	}
};

const getGroups = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId ?? "";
		const groups = await GroupController.getGroups(userId);
		return res.status(200).json(groups);
	} catch (error) {
		next(error);
	}
};

const addContact = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId ?? "";
		const { username, groupId } = req.body;
		if (!username) {
			throw new CustomError({
				message: "Username is required",
				field: "username",
				statusCode: StatusCodes.BAD_REQUEST,
			});
		} else if (!groupId) {
			throw new CustomError({
				message: "Group is required",
				field: "groupId",
				statusCode: StatusCodes.BAD_REQUEST,
			});
		}

		const membership = await GroupController.addContact({
			groupId,
			userId,
			username,
		});

		return res.status(200).json({ message: "User added to group" });
	} catch (error) {
		next(error);
	}
};

const removeContact = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId ?? "";
		const { memberId, groupId } = req.body;
		if (!memberId) {
			throw new CustomError({
				message: "Member is required",
				field: "memberId",
				statusCode: StatusCodes.BAD_REQUEST,
			});
		} else if (!groupId) {
			throw new CustomError({
				message: "Group is required",
				field: "groupId",
				statusCode: StatusCodes.BAD_REQUEST,
			});
		}

		const membership = await GroupController.removeContact({
			groupId,
			userId,
			memberId,
		});

		return res.status(200).json({ message: "User remove from group" });
	} catch (error) {
		next(error);
	}
};

const getMessages = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.userId ?? "";
		const groupId = req.params["id"];
		const messages = await MessageController.getGroupMessages(
			groupId,
			userId
		);
		return res.json(messages);
	} catch (error) {
		next(error);
	}
};

const getMembers = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const groupId = req.params["id"];
		const members = await GroupController.getMembers(groupId);
		return res.json(
			members.map((member) => _.omit(member, ["password", "isOnline"]))
		);
	} catch (error) {
		next(error);
	}
};

const GroupHandler = {
	createGroup,
	getGroups,
	addContact,
	removeContact,
	getMessages,
	getMembers,
};
export default GroupHandler;
