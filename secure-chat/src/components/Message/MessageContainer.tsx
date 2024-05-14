/* eslint-disable no-mixed-spaces-and-tabs */
import { Avatar, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { MessagesList } from "./MessagesList";
import { useSelectedContact } from "../../states/user/useSelectedUser";
import { MessageInput } from "./MessageInput";
import { getAvatarUrl, getGroupAvatarUrl } from "../../utils/avatar";
import { IoArrowBack } from "react-icons/io5";

export const MessageContainer = () => {
	const { selectedContact, selectedGroup, clear } = useSelectedContact();
	if (!selectedContact && !selectedGroup) return <></>;

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
					name={
						selectedContact?.displayName ||
						selectedGroup?.group_name
					}
					src={
						selectedGroup
							? getGroupAvatarUrl(selectedGroup.group_avatar)
							: selectedContact &&
							  getAvatarUrl(selectedContact.avatar)
					}
				/>
				<Flex direction={"column"}>
					<Text fontSize={"lg"} fontWeight={"bold"}>
						{selectedContact?.displayName ||
							selectedGroup?.group_name}
					</Text>
					<Text>
						{selectedContact?.username ||
							selectedGroup?.Members.length + " Members"}
					</Text>
				</Flex>
			</Flex>
			<MessagesList />
			<MessageInput />
		</Flex>
	);
};
