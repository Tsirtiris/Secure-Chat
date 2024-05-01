import { Flex, IconButton, Icon, Input } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { IoAttach, IoSend } from "react-icons/io5";
import { useSocket } from "../../states/socket/useSocket";
import { useMessages } from "../../states/query/message/useMessages";
import { useSelectedContact } from "../../states/user/useSelectedUser";
import { useUser } from "../../states/user/useUser";
import { v4 } from "uuid";
import { encryptMessage } from "../../utils/key";
import { useServerKey } from "../../states/key/useServerKey";

export const MessageInput = () => {
	const { serverKey } = useServerKey();
	const { user } = useUser();
	const { selectedContact } = useSelectedContact();
	const { addUserMessage } = useMessages();
	const [message, setMessage] = useState("");
	const socket = useSocket();

	const handleSendMessage = async (e: FormEvent) => {
		e.preventDefault();
		if (selectedContact && user && message && serverKey) {
			const encryptedMessage = await encryptMessage(message, serverKey);
			const tempId = v4();

			socket.emit("SEND_MESSAGE", {
				message: encryptedMessage,
				contact: selectedContact?.id,
				tempId,
			});

			addUserMessage(selectedContact.id, {
				id: tempId,
				content: message,
				createdAt: new Date().toString(),
				sender_id: user?.id,
				receiver_id: selectedContact.id,
				updatedAt: new Date().toString(),
				isTemp: true,
			});
			setMessage("");
		}
	};

	return (
		<Flex
			as="form"
			onSubmit={(e) => handleSendMessage(e)}
			bg="white"
			boxShadow={"xl"}
			p="2"
			m="4"
			borderRadius={"xl"}
			gap={"2"}
		>
			<label htmlFor="fileInput">
				<IconButton
					aria-label="Send"
					colorScheme="primary"
					variant={"ghost"}
				>
					<Icon as={IoAttach} fontSize={"xl"} />
				</IconButton>
				<Input
					id="fileInput"
					type="file"
					fontSize={"sm"}
					variant={"unstyled"}
					placeholder="Type your message here"
					hidden
				/>
			</label>
			<Input
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				fontSize={"sm"}
				variant={"unstyled"}
				placeholder="Type your message here"
			/>
			<IconButton
				aria-label="Send"
				colorScheme="primary"
				variant={"ghost"}
				type="submit"
				disabled={!message}
			>
				<Icon as={IoSend} />
			</IconButton>
		</Flex>
	);
};
