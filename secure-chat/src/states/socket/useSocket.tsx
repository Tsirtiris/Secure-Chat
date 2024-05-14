import { useEffect } from "react";
import { useMessages } from "../query/message/useMessages";
import { MessageResponse } from "../../api/message.types";
import { useUser } from "../user/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { GET_CONTACTS } from "../query/contact/useContacts";
import SocketKeys from "../../api/socket.types";
import { useSocketState } from "./useSocketState";

export const useSocket = () => {
	const queryClient = useQueryClient();
	const { user } = useUser();
	const { replaceTempWithReal, addUserMessage } = useMessages();
	const { socket } = useSocketState();

	useEffect(() => {
		if (!socket.connected) {
			console.log("Connecting", socket.id);
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
					replaceTempWithReal(contactID ?? "", tempId, message);
				}
			});

			socket.on(SocketKeys.RECEIVE_MESSAGE, (req) => {
				queryClient.invalidateQueries({
					queryKey: [GET_CONTACTS],
				});

				const { message } = req as { message: MessageResponse };
				addUserMessage(message.sender_id, message);
			});

			socket.on(SocketKeys.FRIEND_ONLINE, (req) => {
				const { userId } = req as { userId: string };
				console.log("Online - " + userId);
			});

			socket.on(SocketKeys.FRIEND_OFFLINE, (req) => {
				const { userId } = req as { userId: string };
				console.log("Offline - " + userId);
			});
		}

		return () => {
			console.log("DisConnecting", socket.id);
			socket.disconnect();
		};
	}, [addUserMessage, queryClient, replaceTempWithReal, socket, user]);

	return socket;
};
