import {
	Flex,
	Avatar,
	Text,
	SlideFade,
	Spinner,
	SkeletonText,
	Icon,
	HStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { MessageResponse, MessageTypes } from "../../api/message.types";
import { useUser } from "../../states/user/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { GET_CONTACTS } from "../../states/query/contact/useContacts";
import { ContactResponse } from "../../api/contact.types";
import { getAvatarUrl } from "../../utils/avatar";
import { useDecryptedMessage } from "../../states/key/useDecryptedMessage";
import { IoDocumentAttach } from "react-icons/io5";
import { useDownloadFile } from "../../states/query/message/useDownloadFile";

interface MessageProps {
	message: MessageResponse & { isTemp?: boolean };
}

export const Message = ({ message }: MessageProps) => {
	const client = useQueryClient();
	const { user } = useUser();
	const isMine = user?.id === message.sender_id;
	const contacts = client.getQueryData([GET_CONTACTS]) as
		| ContactResponse[]
		| undefined;
	const contact = contacts?.find(
		(c) =>
			(isMine && c.id === message.receiver_id) ||
			c.id === message.sender_id
	) ?? {
		avatar: "GUEST",
		username: "Loading",
		displayName: "Loading",
		createdAt: new Date().toUTCString(),
		updatedAt: new Date().toUTCString(),
		id: isMine ? message.receiver_id : message.sender_id,
	};

	const decryptedMessage = useDecryptedMessage(message.id, message.content);
	const downloadFile = useDownloadFile();

	const getFormattedFileName = (filename: string) => {
		if (filename.length < 30) {
			return filename;
		}

		return (
			filename.substring(0, 30) +
			"--." +
			filename.split(".")[filename.split(".").length - 1]
		);
	};

	return (
		<Flex direction={"column"} w="full">
			<SlideFade in>
				<Flex
					direction={isMine ? "row-reverse" : "row"}
					alignSelf={isMine ? "flex-end" : "flex-start"}
					gap={"2"}
					alignItems={"flex-end"}
				>
					<Avatar
						name={isMine ? user.displayName : contact.displayName}
						src={getAvatarUrl(
							isMine ? user.avatar : contact.avatar
						)}
						size={"sm"}
						border={"2px solid"}
						borderColor={"white"}
					></Avatar>
					<Flex
						bg={isMine ? "primary" : "white"}
						color={isMine ? "white" : "black"}
						p="4"
						pb="2"
						borderRadius={"xl"}
						borderBottomLeftRadius={!isMine ? "0" : undefined}
						borderBottomRightRadius={isMine ? "0" : undefined}
						boxShadow="md"
						direction={"column"}
						maxW={"50%"}
						overflow={"hidden"}
						textOverflow={"clip"}
					>
						{message.type === MessageTypes.FILE && (
							<HStack
								bg={isMine ? "whiteAlpha.200" : "gray.200"}
								p="2"
								borderRadius={"md"}
								cursor={"pointer"}
								textOverflow={"ellipsis"}
								overflow={"hidden"}
								w="full"
								onClick={() => {
									if (message.isTemp) {
										return;
									}

									downloadFile.mutation.mutate({
										id: message.id,
										filename:
											message.file?.originalName ??
											"data",
									});
								}}
							>
								{downloadFile.mutation.isPending ? (
									<Spinner mr="5" />
								) : (
									<Icon
										as={IoDocumentAttach}
										fontSize={"3xl"}
										mr="5"
									/>
								)}
								<Flex direction={"column"} flex="1">
									<Text
										fontWeight={"bold"}
										fontSize={"sm"}
										textOverflow={"ellipsis"}
									>
										{getFormattedFileName(
											message.file?.originalName ?? ""
										)}
									</Text>
									<Text>
										{(
											(message.file?.size ?? 0) /
											1024 /
											1024
										).toFixed(2)}{" "}
										MB - {downloadFile.progress} %
									</Text>
								</Flex>
							</HStack>
						)}
						{message.type === MessageTypes.PLAIN &&
							(message.isTemp ? (
								<Text as="p" fontSize={"xs"}>
									{message.content}
								</Text>
							) : (
								<>
									{decryptedMessage.isLoading && (
										<SkeletonText noOfLines={2} />
									)}
									{decryptedMessage.data && (
										<Text as="p" fontSize={"xs"}>
											{decryptedMessage.data}
										</Text>
									)}
									{decryptedMessage.isError && (
										<Text as="p" fontSize={"xs"}>
											{decryptedMessage.error.message}
										</Text>
									)}
								</>
							))}

						{message.isTemp ? (
							<Spinner size={"xs"} mt="2" />
						) : (
							<Text
								mt="2"
								fontSize={"xs"}
								color={isMine ? "gray.200" : "gray"}
							>
								{dayjs(message.createdAt).format("hh:mm A")}
							</Text>
						)}
					</Flex>
				</Flex>
			</SlideFade>
		</Flex>
	);
};
