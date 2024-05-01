import { Button, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { User } from "./User";
import { useContacts } from "../../states/query/contact/useContacts";
import { IoPeopleOutline, IoRefreshCircle, IoWarning } from "react-icons/io5";

export const ContactList = () => {
	const contactQuery = useContacts();
	if (contactQuery.isLoading) {
		return (
			<Flex
				direction={"column"}
				alignItems={"center"}
				p="5"
				justifyContent={"center"}
				w="full"
			>
				<Spinner />
				<Text fontSize={"xs"} mt="4">
					Loading Contacts
				</Text>
			</Flex>
		);
	}

	if (contactQuery.isError) {
		return (
			<Flex
				direction={"column"}
				p="3"
				bg="white"
				boxShadow={"md"}
				h="min-content"
				w="full"
				borderRadius={"md"}
				alignItems={"center"}
			>
				<Icon as={IoWarning} fontSize={"5xl"} color={"red.500"} />
				<Text textAlign={"center"} fontSize={"sm"} mt="3">
					Unable to load contacts
				</Text>
				<Button
					mt="6"
					colorScheme="red"
					borderRadius={"lg"}
					fontWeight={"normal"}
					onClick={() => contactQuery.refetch()}
					isLoading={contactQuery.isRefetching}
					leftIcon={<Icon as={IoRefreshCircle} />}
					size={"sm"}
				>
					Retry
				</Button>
			</Flex>
		);
	}

	if (!contactQuery.data || contactQuery.data.length == 0) {
		return (
			<Flex
				direction={"column"}
				p="3"
				bg="white"
				boxShadow={"md"}
				h="min-content"
				w="full"
				borderRadius={"md"}
				alignItems={"center"}
			>
				<Icon as={IoPeopleOutline} fontSize={"5xl"} color={"primary"} />
				<Text textAlign={"center"} fontSize={"sm"} mt="3">
					You don't have<br></br> any contacts yet
				</Text>
			</Flex>
		);
	}
	return (
		<Flex
			flex="1"
			direction={"column"}
			overflow={"auto"}
			gap={"2"}
			sx={{
				"&::-webkit-scrollbar": {
					width: "8px",
					height: "8px",
				},
				"&::-webkit-scrollbar-track": {
					borderRadius: "5px",
					backgroundColor: "gray.100", // Use Chakra UI theme colors
				},
				"&::-webkit-scrollbar-thumb": {
					borderRadius: "9px",
					backgroundColor: "gray.400", // Use Chakra UI theme colors
					transition: "all 300ms",
				},
				"&::-webkit-scrollbar-thumb:hover": {
					backgroundColor: "primary.700", // Use Chakra UI theme colors
				},
				"&::-webkit-scrollbar-thumb:active": {
					backgroundColor: "primary.800", // Use Chakra UI theme colors
				},
			}}
		>
			{contactQuery.data.map((contact) => (
				<User key={contact.id} contact={contact} />
			))}
		</Flex>
	);
};
