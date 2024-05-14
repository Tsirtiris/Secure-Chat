import { Flex, Avatar, AvatarBadge, Text, HStack } from "@chakra-ui/react";
import { getAvatarUrl } from "../../utils/avatar";
import { ContactResponse } from "../../api/contact.types";
import { useSelectedContact } from "../../states/user/useSelectedUser";
import BeatLoader from "react-spinners/BeatLoader";
import { dateFormatter } from "../../config/day.config";

interface UserProps {
	contact: ContactResponse;
}
export const User = ({ contact }: UserProps) => {
	const { setSelectedContact, selectedContact } = useSelectedContact();
	const { displayName, avatar, username } = contact;
	return (
		<Flex
			p="3"
			bg={selectedContact?.id === contact.id ? "white" : undefined}
			boxShadow={selectedContact?.id === contact.id ? "md" : undefined}
			gap={"4"}
			alignItems={"center"}
			cursor={"pointer"}
			borderRadius={"lg"}
			transition={"all 200ms ease-in-out"}
			_hover={{
				bg:
					selectedContact?.id !== contact.id
						? "blackAlpha.100"
						: undefined,
			}}
			onClick={() => {
				setSelectedContact(contact);
			}}
		>
			<Avatar
				name={contact.displayName}
				src={getAvatarUrl(avatar)}
				size={"md"}
				border={"2px solid"}
				borderColor={"black"}
			>
				<AvatarBadge
					border={"2px solid"}
					boxSize={"1em"}
					bg={contact.isOnline ? "primary.400" : "gray.200"}
					boxShadow={"md"}
				/>
			</Avatar>
			<Flex direction={"column"}>
				<Text fontWeight={"bold"} fontSize={"sm"}>
					{displayName}
				</Text>
				<Text fontSize={"xs"} color={"gray"}>
					{username}
				</Text>
				<Text fontSize={"xs"} color={"gray.600"} mt="1">
					{contact.isTyping ? (
						<HStack color={"primary"} as="span">
							<BeatLoader size={"6px"} color="#224890" />
							<Text>Typing...</Text>
						</HStack>
					) : contact.isOnline ? (
						<Text color={"primary"} as="span">
							online
						</Text>
					) : (
						dateFormatter(contact.updatedAt).fromNow()
					)}
				</Text>
			</Flex>
		</Flex>
	);
};
