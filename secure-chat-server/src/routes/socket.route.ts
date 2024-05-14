import { Server } from "socket.io";
import * as http from "http";
import * as https from "https";
import {
	SocketJWTMiddleware,
	SocketWithToken,
} from "../middleware/auth.middleware";
import _ from "lodash";
import SocketKeys from "../interfaces/socket.types";
import SocketHandler from "../api/socket.handlers";

const initializeChatSocket = (
	server:
		| http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
		| https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
	CurrentOnline: Map<string, string>
) => {
	const io = new Server(server, {
		cors: {
			origin: "*",
			optionsSuccessStatus: 200,
		},
	});

	io.use(SocketJWTMiddleware);

	io.on(SocketKeys.CONNECTION, async (socket: SocketWithToken) => {
		const userId = SocketHandler.onConnection(io, socket, CurrentOnline);

		if (!userId) {
			return;
		}

		socket.on(SocketKeys.SEND_MESSAGE, async (req) => {
			await SocketHandler.onSendMessage(io, socket, CurrentOnline, req);
		});

		socket.on(SocketKeys.TYPING, async (req) => {
			await SocketHandler.onTypingStarted(io, socket, CurrentOnline, req);
		});

		socket.on(SocketKeys.TYPING_DONE, async (req) => {
			await SocketHandler.onTypingEnded(io, socket, CurrentOnline, req);
		});

		socket.on(SocketKeys.FILE_SENT, async (req) => {
			await SocketHandler.onFileSent(io, socket, CurrentOnline, req);
		});
	});
};

export default initializeChatSocket;
