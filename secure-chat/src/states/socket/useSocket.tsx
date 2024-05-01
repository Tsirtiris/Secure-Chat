import { Socket, io } from "socket.io-client";
import { BASE_URL } from "../../utils/api";
import { TOKEN } from "../../utils/token";
import { create } from "zustand";
import { useEffect } from "react";
import { useMessages } from "../query/message/useMessages";
import { MessageResponse } from "../../api/message.types";
import { useUser } from "../user/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { GET_CONTACTS } from "../query/contact/useContacts";

type State = {
	socket: Socket;
};

type Action = {
	setSocket: (socket: Socket) => void;
};
export const useSocketState = create<State & Action>((set) => ({
	socket: io(BASE_URL, {
		autoConnect: false,
		reconnection: true,
		auth: {
			token: window.localStorage.getItem(TOKEN),
		},
	}),
	setSocket: (newSocket: Socket) =>
		set((state) => ({ ...state, socket: newSocket })),
}));

export const useSocket = () => {
	const queryClient = useQueryClient();
	const { user } = useUser();
	const { replaceTempWithReal, addUserMessage } = useMessages();
	const { socket } = useSocketState();

	useEffect(() => {
		if (!socket.connected) {
			socket.connect();
		}
		if (socket.connected) {
			socket.on("SEND_MESSAGE_SUCCESS", (req) => {
				const { message, tempId } = req as {
					message: MessageResponse;
					tempId: string;
				};
				if (user) {
					const contactID =
						message.sender_id == user?.id
							? message.receiver_id
							: message.sender_id;
					replaceTempWithReal(contactID, tempId, message);
				}
			});

			socket.on("RECEIVE_MESSAGE", (req) => {
				console.log("Received Message");
				queryClient.invalidateQueries({
					queryKey: [GET_CONTACTS],
				});

				const { message } = req as { message: MessageResponse };
				addUserMessage(message.sender_id, message);
			});
		}

		return () => {
			socket.disconnect();
		};
	}, [addUserMessage, queryClient, replaceTempWithReal, socket, user]);

	return socket;
};
