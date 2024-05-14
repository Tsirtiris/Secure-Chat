import { Flex, Image, Text } from "@chakra-ui/react";
import { EmptyMessageImg } from "../../assets";
import { useSelectedContact } from "../../states/user/useSelectedUser";
import { ChatModes, useChatMode } from "../../states/chat/useChatMode";

export const EmptyMessages = () => {
	const { selectedContact } = useSelectedContact();
	const { mode } = useChatMode();

	return (
		<Flex
			direction={"column"}
			flex="1"
			alignItems={"center"}
			justifyContent={"center"}
		>
			<Image src={EmptyMessageImg} w="40%" />
			<Text mt="5" color={"gray.700"}>
				{mode == ChatModes.GROUP
					? "There is no conversation here"
					: `You have no conversation with ${selectedContact?.displayName}.`}
			</Text>
			<Text mt="1" fontWeight={"bold"} fontSize={"xl"}>
				Start by saying "Hi"
			</Text>
		</Flex>
	);
};
