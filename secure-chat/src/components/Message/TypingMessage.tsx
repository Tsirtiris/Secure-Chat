import { Flex, SlideFade, Avatar } from "@chakra-ui/react";
import { getAvatarUrl } from "../../utils/avatar";
import { useSelectedContact } from "../../states/user/useSelectedUser";
import BeatLoader from "react-spinners/BeatLoader";

export const TypingMessage = () => {
	const { selectedContact } = useSelectedContact();
	return (
		<Flex direction={"column"} w="full">
			<SlideFade
				in={selectedContact?.isTyping}
				hidden={!selectedContact?.isTyping}
			>
				<Flex
					direction={"row"}
					alignSelf={"flex-start"}
					gap={"2"}
					alignItems={"flex-end"}
				>
					<Avatar
						name={selectedContact?.displayName}
						src={getAvatarUrl(selectedContact?.avatar ?? "")}
						size={"sm"}
						border={"2px solid"}
						borderColor={"white"}
					></Avatar>
					<Flex
						bg={"white"}
						color={"black"}
						p="4"
						borderRadius={"xl"}
						borderBottomLeftRadius={"0"}
						boxShadow="md"
						direction={"column"}
						maxW={"50%"}
					>
						<BeatLoader size={"10px"} color="gray" />
					</Flex>
				</Flex>
			</SlideFade>
		</Flex>
	);
};
