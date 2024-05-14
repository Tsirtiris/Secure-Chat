import {
	Flex,
	HStack,
	Icon,
	Heading,
	InputGroup,
	InputLeftElement,
	Input,
	IconButton,
	Button,
	useDisclosure,
} from "@chakra-ui/react";
import { IoLockClosed, IoSearch, IoPersonAdd, IoAdd } from "react-icons/io5";
import { ProfileIcon } from "./ProfileIcon";
import { useState } from "react";
import { ContactList } from "./ContactList";
import { useAddContactMutation } from "../../states/query/contact/useAddContactMutation";
import {
	ChatModeType,
	ChatModes,
	useChatMode,
} from "../../states/chat/useChatMode";
import { GroupList } from "./GroupList";
import { CreateGroup } from "../Group/CreateGroup";

export const Sidebar = () => {
	const { mode, setMode } = useChatMode();
	const addMutation = useAddContactMutation();
	const createDialog = useDisclosure();
	const [username, setUsername] = useState("");
	return (
		<Flex
			as="aside"
			w={{ base: "full", md: "40%", lg: "300px" }}
			h="full"
			bg="background"
			direction={"column"}
			p="5"
			borderRadius={{ base: "lg", md: "0" }}
		>
			<Flex alignItems={"center"} justifyContent={"space-between"}>
				<HStack justifyContent={"center"} alignItems={"end"}>
					<Icon as={IoLockClosed} fontSize={"3xl"} />
					<Heading fontSize={"xl"} fontWeight={"bold"}>
						SecureChat
					</Heading>
				</HStack>
				<ProfileIcon />
			</Flex>
			<Flex
				bg="white"
				p="2"
				mt="5"
				border={"1px solid"}
				borderColor={"gray.200"}
				borderRadius={"lg"}
				gap={"2"}
			>
				{Object.keys(ChatModes).map((type, index) => (
					<Button
						key={index}
						flex="1"
						size={"sm"}
						colorScheme={mode === type ? "primary" : "gray"}
						variant={mode === type ? "solid" : "ghost"}
						onClick={() => setMode(type as ChatModeType)}
						textTransform={"capitalize"}
						fontWeight={"500"}
					>
						{type.toLowerCase()}
					</Button>
				))}
			</Flex>
			{mode === ChatModes.GROUP && (
				<>
					<CreateGroup {...createDialog} />
					<Button
						onClick={createDialog.onOpen}
						colorScheme="primary"
						variant={"outline"}
						leftIcon={<Icon as={IoAdd} />}
						size={"sm"}
						fontWeight={"500"}
						my="4"
					>
						Add new group
					</Button>
				</>
			)}
			<Flex flex={"1"} mt="3">
				{mode == ChatModes.GROUP ? <GroupList /> : <ContactList />}
			</Flex>
			{mode === ChatModes.PERSONAL && (
				<Flex gap="2" mt="5">
					<InputGroup>
						<InputLeftElement>
							<Icon as={IoSearch} />
						</InputLeftElement>
						<Input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="add contact by username"
							bg="white"
							boxShadow={"xl"}
							fontSize={"xs"}
						/>
					</InputGroup>
					<IconButton
						aria-label="Add User"
						colorScheme="primary"
						boxShadow={"xl"}
						borderRadius={"xl"}
						isLoading={addMutation.isPending}
						onClick={() => {
							if (username)
								addMutation.mutate(username, {
									onSuccess: () => setUsername(""),
								});
						}}
					>
						<Icon as={IoPersonAdd} />
					</IconButton>
				</Flex>
			)}
		</Flex>
	);
};
