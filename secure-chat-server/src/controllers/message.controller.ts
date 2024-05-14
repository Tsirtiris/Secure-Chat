import { Prisma, Scope, Type } from "@prisma/client";
import {
	decryptMessageFromDatabase,
	encryptMessageForUser,
} from "../utils/encryption";
import prisma from "../utils/prisma.config";
import UserController from "./user.controller";
import { CustomError } from "../middleware/error.middleware";
import { StatusCodes } from "http-status-codes";

export const getMessages = async (userId: string, contactId: string) => {
	const user = await UserController.getUser(userId);
	if (!user) {
		throw new Error("user doesn't exits");
	}

	const messages = await prisma.message.findMany({
		where: {
			OR: [
				{
					sender_id: userId,
					receiver_id: contactId,
				},
				{
					sender_id: contactId,
					receiver_id: userId,
				},
			],
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			file: true,
		},
	});

	return Promise.all(
		messages.map(async (message) => {
			if (message.type === Type.PLAIN) {
				const plain = decryptMessageFromDatabase(
					message.content,
					message.key
				);
				const encrypted = await encryptMessageForUser(
					plain,
					user.pubKey
				);
				return {
					...message,
					content: encrypted,
				};
			}
			return message;
		})
	);
};

interface addMessageProps {
	userId: string;
	receiverId: string;
	message: string;
	mode: Scope;
	key: string;
	type?: Type;
	file?: Omit<Prisma.FileMetadataCreateInput, "message">;
}
export const addMessage = async ({
	userId,
	receiverId,
	message,
	mode,
	key,
	type,
	file,
}: addMessageProps) => {
	const newMessage = await prisma.message.create({
		data: {
			content: message,
			receiver_id: mode === Scope.PERSONAL ? receiverId : undefined,
			group_id: mode === Scope.GROUP ? receiverId : undefined,
			sender_id: userId,
			scope: mode,
			type,
			key,
			file: file
				? {
						create: file,
				  }
				: undefined,
		},
		include: {
			sender: true,
			receiver: true,
			group: true,
			file: true,
		},
	});

	if (mode == Scope.PERSONAL) {
		const contact = await prisma.contact.count({
			where: {
				user_id: receiverId,
				contact_id: userId,
			},
		});

		if (contact === 0) {
			await prisma.contact.create({
				data: {
					user_id: receiverId,
					contact_id: userId,
				},
			});
		}
	}

	return newMessage;
};

const getGroupMessages = async (groupId: string, userId: string) => {
	const group = await prisma.group.findUnique({
		where: { id: groupId },
		include: { Members: true },
	});

	const user = await UserController.getUser(userId);
	if (!user) {
		throw new Error("user doesn't exits");
	}

	if (!group) {
		throw new Error("user doesn't exits");
	}
	let membersId = group.Members.map((g) => g.userId);
	if (!membersId.includes(userId)) {
		throw new CustomError({
			message: "User is not a member of this group",
			statusCode: StatusCodes.UNAUTHORIZED,
		});
	}

	const messages = await prisma.message.findMany({
		where: {
			group_id: group.id,
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			file: true,
		},
	});

	return Promise.all(
		messages.map(async (message) => {
			if (message.type === Type.PLAIN) {
				const plain = decryptMessageFromDatabase(
					message.content,
					message.key
				);
				const encrypted = await encryptMessageForUser(
					plain,
					user.pubKey
				);
				return {
					...message,
					content: encrypted,
				};
			}
			return message;
		})
	);
};

const getMessageById = async (messageId: string) => {
	const message = await prisma.message.findUnique({
		where: { id: messageId },
		include: {
			file: true,
		},
	});
	return message;
};

const MessageController = {
	getMessages,
	addMessage,
	getGroupMessages,
	getMessageById,
};
export default MessageController;
