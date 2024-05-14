import { Flex, IconButton, Icon, Input, Text } from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { IoAttach, IoFileTray, IoSend } from "react-icons/io5";
import { useMessages } from "../../states/query/message/useMessages";
import { useSelectedContact } from "../../states/user/useSelectedUser";
import { useUser } from "../../states/user/useUser";
import { v4 } from "uuid";
import { encryptMessage } from "../../utils/key";
import { useServerKey } from "../../states/key/useServerKey";
import SocketKeys from "../../api/socket.types";
import { useDebouncedCallback } from "use-debounce";
import { socket } from "../../utils/socket";
import { ChatModes, useChatMode } from "../../states/chat/useChatMode";
import { MessageTypes } from "../../api/message.types";
import { useUploadFile } from "../../states/query/message/useUploadFile";

export const MessageInput = () => {
	const { serverKey } = useServerKey();
	const { user } = useUser();
	const { mode } = useChatMode();
	const { selectedContact, selectedGroup } = useSelectedContact();
	const { addUserMessage, replaceTempWithReal } = useMessages();
	const [file, setFile] = useState<File | null>(null);
	const [response, setMessage] = useState("");
	const [typing, setTyping] = useState(false);
	const { mutation: uploadMutation } = useUploadFile();
	const debounce = useDebouncedCallback(() => {
		if (selectedContact) {
			socket.emit(SocketKeys.TYPING_DONE, {
				contactId: selectedContact.id,
			});
		}
		setTyping(false);
	}, 1000);

	const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);
		if (!typing) {
			setTyping(true);
			socket.emit(SocketKeys.TYPING, { contactId: selectedContact?.id });
		}
		debounce();
	};

	const handleSendMessage = async (e: FormEvent) => {
		e.preventDefault();

		if ((selectedGroup || selectedContact) && file && user && serverKey) {
			const id = selectedGroup
				? selectedGroup.id
				: selectedContact
				? selectedContact.id
				: "";
			const tempId = v4();
			const formData = new FormData();
			formData.append("file", file);
			formData.append("receiverId", id);
			formData.append("mode", mode);
			formData.append("tempId", tempId);

			addUserMessage(id, {
				id: tempId,
				content: "",
				createdAt: new Date().toString(),
				sender_id: user?.id,
				receiver_id: id,
				scope: mode,
				type: MessageTypes.FILE,
				updatedAt: new Date().toString(),
				isTemp: true,
				file: {
					filename: file.name,
					size: file.size,
					id: tempId,
					message_id: tempId,
					mimeType: file.type,
					originalName: file.name,
				},
			});

			setFile(null);
			const response = await uploadMutation.mutateAsync(formData);

			socket.emit(SocketKeys.FILE_SENT, {
				messageId: response.id,
			});
			const contactID = response.group_id
				? response.group_id
				: response.sender_id == user?.id
				? response.receiver_id
				: response.sender_id;

			replaceTempWithReal(contactID ?? "", tempId, response);
		} else if (
			(selectedGroup || selectedContact) &&
			user &&
			response &&
			serverKey
		) {
			const encryptedMessage = await encryptMessage(response, serverKey);
			const tempId = v4();
			const id =
				ChatModes.GROUP && selectedGroup
					? selectedGroup.id
					: ChatModes.PERSONAL && selectedContact
					? selectedContact.id
					: undefined;

			if (!id) {
				return;
			}

			socket.emit(SocketKeys.SEND_MESSAGE, {
				message: encryptedMessage,
				receiverId: id,
				mode,
				tempId,
			});

			addUserMessage(id, {
				id: tempId,
				content: response,
				createdAt: new Date().toString(),
				sender_id: user?.id,
				receiver_id: id,
				scope: mode,
				type: MessageTypes.PLAIN,
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
			borderTopRadius={file ? "0" : undefined}
			gap={"2"}
			position={"relative"}
		>
			{file && (
				<Flex
					position={"absolute"}
					bottom={"100%"}
					left={"0"}
					right={"0"}
					bg="gray.50"
					p="3"
					borderRadius={"lg"}
					borderBottomRadius={"0"}
					gap={"2"}
					alignItems={"center"}
				>
					<Icon as={IoFileTray} color={"primary"} fontSize={"3xl"} />
					<Flex direction={"column"}>
						<Text fontWeight={"bold"}>{file.name}</Text>
						<Text color={"gray.500"}>
							{(file.size / 1024 / 1024).toFixed(2)} MB
						</Text>
					</Flex>
				</Flex>
			)}
			<IconButton
				aria-label="Send"
				colorScheme="primary"
				variant={"ghost"}
				as="label"
				htmlFor="fileInput"
			>
				<Icon as={IoAttach} fontSize={"xl"} />
			</IconButton>
			<input
				id="fileInput"
				type="file"
				onChange={(e) => e.target.files && setFile(e.target.files[0])}
				hidden
			/>
			<Input
				value={response}
				onChange={handleMessageChange}
				fontSize={"sm"}
				variant={"unstyled"}
				placeholder="Type your message here"
			/>
			<IconButton
				aria-label="Send"
				colorScheme="primary"
				variant={"ghost"}
				type="submit"
				disabled={!response}
			>
				<Icon as={IoSend} />
			</IconButton>
		</Flex>
	);
};
