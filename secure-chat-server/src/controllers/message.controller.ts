import {
	decryptMessageFromDatabase,
	encryptMessageForUser,
} from "../utils/encryption";
import prisma from "../utils/prisma.config";
import UserController from "./user.controller";

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
	});

	return Promise.all(
		messages.map(async (message) => {
			const plain = decryptMessageFromDatabase(
				message.content,
				message.key
			);
			const encrypted = await encryptMessageForUser(plain, user.pubKey);
			return {
				...message,
				content: encrypted,
			};
		})
	);
};

interface addMessageProps {
	userId: string;
	contactId: string;
	message: string;
	key: string;
}
export const addMessage = async ({
	userId,
	contactId,
	message,
	key,
}: addMessageProps) => {
	const newMessage = await prisma.message.create({
		data: {
			content: message,
			receiver_id: contactId,
			sender_id: userId,
			key,
		},
		include: {
			sender: true,
			receiver: true,
		},
	});

	const contact = await prisma.contact.count({
		where: {
			user_id: contactId,
			contact_id: userId,
		},
	});

	if (contact === 0) {
		await prisma.contact.create({
			data: {
				user_id: contactId,
				contact_id: userId,
			},
		});
	}

	return newMessage;
};

const MessageController = {
	getMessages,
	addMessage,
};
export default MessageController;
