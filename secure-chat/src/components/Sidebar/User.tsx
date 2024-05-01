import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";
import { getAvatarUrl } from "../../utils/avatar";
import { ContactResponse } from "../../api/contact.types";
import { useSelectedContact } from "../../states/user/useSelectedUser";

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
				size={"sm"}
				border={"2px solid"}
				borderColor={"black"}
			>
				<AvatarBadge boxSize={"1em"} bg="primary" />
			</Avatar>
			<Flex direction={"column"}>
				<Text fontWeight={"bold"} fontSize={"sm"}>
					{displayName}
				</Text>
				<Text fontSize={"xs"} color={"gray"}>
					{username}
				</Text>
			</Flex>
		</Flex>
	);
};
