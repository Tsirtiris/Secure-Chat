import _ from "lodash";
import MessageController from "../controllers/message.controller";
import SocketKeys from "../interfaces/socket.types";
import { SocketWithToken } from "../middleware/auth.middleware";
import {
	decryptMessageFromUser,
	encryptMessageForDatabase,
	encryptMessageForUser,
} from "../utils/encryption";
import logger from "../utils/logger.config";
import { Server, ServerOptions } from "socket.io";
import ContactsController from "../controllers/contact.controller";
import UserController from "../controllers/user.controller";
import { Scope } from "@prisma/client";
import GroupController from "../controllers/group.controller";

const onConnection = async (
	io: Server,
	socket: SocketWithToken,
	CurrentOnline: Map<string, string>
) => {
	const userId = socket.userId;

	if (!userId) {
		return;
	}

	const rooms = CurrentOnline.get(userId) ?? [];
	CurrentOnline.set(userId, socket.id);

	socket.join(userId);
	const contacts = (await ContactsController.getContacts(userId)).map(
		(val) => val.id
	);

	await UserController.setOnlineStatus(userId, true);
	CurrentOnline.forEach((value: string, key: string) => {
		if (contacts.includes(key)) {
			const id = CurrentOnline.get(key);
			if (id) {
				io.to(id).emit(SocketKeys.FRIEND_ONLINE, {
					userId: userId,
				});
			}
		}
	});

	console.log(CurrentOnline);

	socket.on(SocketKeys.DISCONNECTING, async () => {
		try {
			console.log("Disconnecting");
			console.log({ id: userId, socket: socket.id });
			CurrentOnline.forEach(async (value: string, key: string) => {
				if (value == socket.id) {
					CurrentOnline.delete(key);
					await UserController.setOnlineStatus(userId, false);

					CurrentOnline.forEach((value: string, key: string) => {
						if (contacts.includes(key)) {
							const id = CurrentOnline.get(key);
							if (id) {
								io.to(id).emit(SocketKeys.FRIEND_OFFLINE, {
									userId: userId,
								});
							}
						}
					});
				}
			});
			console.log(CurrentOnline);
		} catch (err) {
			logger.error(err);
		}
	});

	return userId;
};

const onSendMessage = async (
	io: Server,
	socket: SocketWithToken,
	CurrentOnline: Map<string, string>,
	req: any
) => {
	const userId = socket.userId;
	if (!userId) {
		return;
	}

	try {
		const { message, receiverId, mode, tempId } = req;
		if (!message || !receiverId || !mode || !tempId) {
			socket.emit(SocketKeys.SEND_MESSAGE_ERROR, {
				message: "Message and contact are required",
			});
			return;
		}

		const plainMessage = await decryptMessageFromUser(message);
		const secureMessage = encryptMessageForDatabase(plainMessage);

		const newMessage = await MessageController.addMessage({
			userId,
			receiverId: receiverId,
			mode,
			message: secureMessage.encryptedMessage,
			key: secureMessage.encryptedAesKey,
		});

		const encryptSenderMessage = await encryptMessageForUser(
			plainMessage,
			newMessage.sender.pubKey
		);
		let msgToSend = _.omit(newMessage, ["sender", "receiver", "group"]);

		if (newMessage.scope == Scope.PERSONAL && newMessage.receiver) {
			const encryptReceiverMessageContent = await encryptMessageForUser(
				plainMessage,
				newMessage.receiver.pubKey
			);

			let msgToReceiver = {
				...msgToSend,
				content: encryptReceiverMessageContent,
			};

			if (CurrentOnline.has(newMessage.receiver.id)) {
				const room = CurrentOnline.get(newMessage.receiver.id);
				if (room) {
					io.to(room).emit(SocketKeys.RECEIVE_MESSAGE, {
						message: msgToReceiver,
					});
				}
			}
		} else if (newMessage.scope == Scope.GROUP && newMessage.group) {
			const members = await GroupController.getMembers(
				newMessage.group.id
			);

			Promise.all(
				members.map(async (member) => {
					if (member.id === newMessage.sender.id) return;
					const encryptReceiverMessageContent =
						await encryptMessageForUser(
							plainMessage,
							member.pubKey
						);

					let msgToReceiver = {
						...msgToSend,
						content: encryptReceiverMessageContent,
					};

					if (CurrentOnline.has(member.id)) {
						const room = CurrentOnline.get(member.id);
						if (room) {
							io.to(room).emit(SocketKeys.RECEIVE_MESSAGE, {
								message: msgToReceiver,
							});
						}
					}
				})
			);
		}

		let msgToSender = {
			...msgToSend,
			content: encryptSenderMessage,
		};

		socket.emit(SocketKeys.SEND_MESSAGE_SUCCESS, {
			message: msgToSender,
			tempId,
		});
	} catch (error) {
		socket.emit(SocketKeys.ERROR, {
			message: "Something went wrong",
		});
		logger.error(error);
	}
};

const onTypingStarted = async (
	io: Server,
	socket: SocketWithToken,
	CurrentOnline: Map<string, string>,
	req: { contactId: string }
) => {
	try {
		const userId = socket.userId;
		const { contactId } = req;
		const socketId = CurrentOnline.get(contactId);
		if (socketId && userId && contactId) {
			io.to(socketId).emit(SocketKeys.TYPING, {
				contactId: userId,
			});
		}
	} catch (error) {
		logger.error(error);
	}
};

const onTypingEnded = async (
	io: Server,
	socket: SocketWithToken,
	CurrentOnline: Map<string, string>,
	req: { contactId: string }
) => {
	try {
		const userId = socket.userId;
		const { contactId } = req;
		const socketId = CurrentOnline.get(contactId);
		if (socketId && userId && contactId) {
			io.to(socketId).emit(SocketKeys.TYPING_DONE, {
				contactId: userId,
			});
		}
	} catch (error) {
		logger.error(error);
	}
};

const onFileSent = async (
	io: Server,
	socket: SocketWithToken,
	CurrentOnline: Map<string, string>,
	req: { messageId?: string }
) => {
	const { messageId } = req;
	if (!messageId) {
		return;
	}

	const message = await MessageController.getMessageById(messageId);
	if (!message) {
		return;
	}

	let messageToSend = _.omit(message, ["key"]);

	if (message.scope == Scope.PERSONAL && message.receiver_id) {
		if (CurrentOnline.has(message.receiver_id)) {
			const room = CurrentOnline.get(message.receiver_id);
			if (room) {
				io.to(room).emit(SocketKeys.RECEIVE_MESSAGE, {
					message: messageToSend,
				});
			}
		}
	} else if (message.scope == Scope.GROUP && message.group_id) {
		const members = await GroupController.getMembers(message.group_id);

		Promise.all(
			members.map(async (member) => {
				if (member.id === message.sender_id) return;

				if (CurrentOnline.has(member.id)) {
					const room = CurrentOnline.get(member.id);
					if (room) {
						io.to(room).emit(SocketKeys.RECEIVE_MESSAGE, {
							message: messageToSend,
						});
					}
				}
			})
		);
	}
};

const SocketHandler = {
	onConnection,
	onSendMessage,
	onTypingStarted,
	onTypingEnded,
	onFileSent,
};
export default SocketHandler;
