import { ReactNode, useEffect } from "react";
import { useUser } from "../../states/user/useUser";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/token";
import { socket } from "../../utils/socket";
import { MessageResponse } from "../../api/message.types";
import { useMessages } from "../../states/query/message/useMessages";
import SocketKeys from "../../api/socket.types";
import { GET_CONTACTS } from "../../states/query/contact/useContacts";
import { useQueryClient } from "@tanstack/react-query";
import { ContactResponse } from "../../api/contact.types";
import { useSelectedContact } from "../../states/user/useSelectedUser";
import { ChatModes } from "../../states/chat/useChatMode";

interface GuardProps {
	children?: ReactNode;
}

export const Guard = ({ children }: GuardProps) => {
	const { token } = getToken();
	const { user } = useUser();
	const { selectedContact, setSelectedContact } = useSelectedContact();
	const { replaceTempWithReal, addUserMessage } = useMessages();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user && token) {
			navigate("/");
		} else if (!user && !token) {
			navigate("/login");
		}
	}, [user, navigate, token]);

	useEffect(() => {
		if (!socket.connected && token) {
			socket.connect();
		}

		if (socket.connected) {
			socket.on(SocketKeys.SEND_MESSAGE_SUCCESS, (req) => {
				const { message, tempId } = req as {
					message: MessageResponse;
					tempId: string;
				};
				if (user) {
					const contactID = message.group_id
						? message.group_id
						: message.sender_id == user?.id
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
				const id =
					message.scope === ChatModes.GROUP
						? message.group_id
						: message.sender_id;
				addUserMessage(id ?? "", message);
			});

			socket.on(SocketKeys.FRIEND_ONLINE, (req) => {
				const { userId } = req as { userId: string };
				queryClient.setQueryData<ContactResponse[]>(
					[GET_CONTACTS],
					(data) => {
						if (data) {
							return data.map((contact) => {
								if (contact.id == userId) {
									return { ...contact, isOnline: true };
								}
								return contact;
							});
						}
					}
				);
			});

			socket.on(SocketKeys.FRIEND_OFFLINE, (req) => {
				const { userId } = req as { userId: string };
				queryClient.setQueryData<ContactResponse[]>(
					[GET_CONTACTS],
					(data) => {
						if (data) {
							return data.map((contact) => {
								if (contact.id == userId) {
									return {
										...contact,
										isOnline: false,
										isTyping: false,
										updatedAt: new Date().toISOString(),
									};
								}
								return contact;
							});
						}
					}
				);
			});

			socket.on(SocketKeys.TYPING, (req) => {
				const { contactId } = req as { contactId: string };
				queryClient.setQueryData<ContactResponse[]>(
					[GET_CONTACTS],
					(data) => {
						if (data) {
							return data.map((contact) => {
								if (contact.id == contactId) {
									return {
										...contact,
										isTyping: true,
									};
								}
								return contact;
							});
						}
					}
				);
				if (selectedContact?.id == contactId) {
					setSelectedContact({ ...selectedContact, isTyping: true });
				}
			});

			socket.on(SocketKeys.TYPING_DONE, (req) => {
				const { contactId } = req as { contactId: string };
				queryClient.setQueryData<ContactResponse[]>(
					[GET_CONTACTS],
					(data) => {
						if (data) {
							return data.map((contact) => {
								if (contact.id == contactId) {
									return {
										...contact,
										isTyping: false,
									};
								}
								return contact;
							});
						}
					}
				);
				if (selectedContact?.id == contactId) {
					setSelectedContact({ ...selectedContact, isTyping: false });
				}
			});
		}

		return () => {
			socket.off(SocketKeys.SEND_MESSAGE_SUCCESS);
			socket.off(SocketKeys.RECEIVE_MESSAGE);
			socket.off(SocketKeys.FRIEND_OFFLINE);
			socket.off(SocketKeys.FRIEND_ONLINE);
			socket.off(SocketKeys.TYPING);
			socket.off(SocketKeys.TYPING_DONE);
		};
	}, [
		addUserMessage,
		queryClient,
		replaceTempWithReal,
		selectedContact,
		setSelectedContact,
		token,
		user,
	]);

	return <>{children}</>;
};
