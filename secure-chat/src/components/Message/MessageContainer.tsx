import { Avatar, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { MessagesList } from "./MessagesList";
import { useSelectedContact } from "../../states/user/useSelectedUser";
import { MessageInput } from "./MessageInput";
import { getAvatarUrl } from "../../utils/avatar";
import { IoArrowBack } from "react-icons/io5";

export const MessageContainer = () => {
	const { selectedContact, clear } = useSelectedContact();
	if (!selectedContact) return <></>;

	return (
		<Flex
			bg="background"
			w="full"
			h="full"
			borderRadius={"lg"}
			boxShadow={"xl"}
			direction={"column"}
			overflow={"hidden"}
		>
			<Flex
				p="3"
				bg="white"
				boxShadow={"lg"}
				alignItems={"center"}
				gap={"4"}
				hideFrom={"md"}
			>
				<IconButton aria-label="Back" onClick={() => clear()}>
					<Icon as={IoArrowBack} />
				</IconButton>
				<Avatar
					name={selectedContact.displayName}
					src={getAvatarUrl(selectedContact.avatar)}
				/>
				<Flex direction={"column"}>
					<Text fontSize={"lg"} fontWeight={"bold"}>
						{selectedContact.displayName}
					</Text>
					<Text>{selectedContact.username}</Text>
				</Flex>
			</Flex>
			<MessagesList />
			<MessageInput />
		</Flex>
	);
};
