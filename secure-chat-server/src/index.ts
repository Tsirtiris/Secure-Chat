import http from "http";
import https from "https";
import app from "./app";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";
import {
	SocketJWTMiddleware,
	SocketWithToken,
} from "./middleware/auth.middleware";
import MessageController from "./controllers/message.controller";
import {
	decryptMessageFromUser,
	encryptMessageForDatabase,
	encryptMessageForUser,
} from "./utils/encryption";
import UserController from "./controllers/user.controller";
import _ from "lodash";
import logger from "./utils/logger.config";

const options =
	process.env.NODE_ENV === "production"
		? {}
		: {
				key: fs.readFileSync(path.join(__dirname, "server-key.pem")),
				cert: fs.readFileSync(path.join(__dirname, "server.pem")),
		  };

const server =
	process.env.NODE_ENV === "production"
		? http.createServer(app)
		: https.createServer(options, app);

const io = new Server(server, {
	cors: {
		origin: "*",
		optionsSuccessStatus: 200,
	},
});
io.use(SocketJWTMiddleware);

const CurrentOnline = new Map<string, string[]>();

io.on("connection", async (socket: SocketWithToken) => {
	const userId = socket.userId;

	if (!userId) {
		return;
	}

	const rooms = CurrentOnline.get(userId) ?? [];
	CurrentOnline.set(userId, [...rooms, socket.id]);

	socket.join(userId);
	// TODO: SET_ONLINE
	console.log(CurrentOnline);

	socket.on("disconnecting", async () => {
		CurrentOnline.forEach(async (value: string[], key: string) => {
			if (value.indexOf(socket.id) != -1) {
				value = value.filter((id) => id != socket.id);
				if (value.length == 0) {
					// TODO: SET_OFFLINE
					CurrentOnline.delete(key);
				} else {
					CurrentOnline.set(key, value);
				}
			}
		});
		console.log(CurrentOnline);
	});

	socket.on("SEND_MESSAGE", async (req) => {
		try {
			const { message, contact, tempId } = req;
			if (!message || !contact) {
				socket.emit("SEND_MESSAGE_ERROR", {
					message: "Message and contact are required",
				});
				return;
			}

			const plainMessage = await decryptMessageFromUser(message);
			const secureMessage = encryptMessageForDatabase(plainMessage);

			const newMessage = await MessageController.addMessage({
				userId,
				contactId: contact,
				message: secureMessage.encryptedMessage,
				key: secureMessage.encryptedAesKey,
			});

			const encryptReceiverMessageContent = await encryptMessageForUser(
				plainMessage,
				newMessage.receiver.pubKey
			);

			const encryptSenderMessage = await encryptMessageForUser(
				plainMessage,
				newMessage.sender.pubKey
			);

			let msgToSend = _.omit(newMessage, ["sender", "receiver"]);
			let msgToReceiver = {
				...msgToSend,
				content: encryptReceiverMessageContent,
			};
			let msgToSender = { ...msgToSend, content: encryptSenderMessage };

			if (CurrentOnline.has(contact)) {
				const rooms = CurrentOnline.get(contact) ?? [];

				rooms.map((room) => {
					io.to(room).emit("RECEIVE_MESSAGE", {
						message: msgToReceiver,
					});
				});
			}

			socket.emit("SEND_MESSAGE_SUCCESS", {
				message: msgToSender,
				tempId,
			});
		} catch (error) {
			socket.emit("ERROR", {
				message: "Something went wrong",
			});
			logger.error(error);
		}
	});
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
	console.log(`Listening: https://localhost:${port}`);
});
