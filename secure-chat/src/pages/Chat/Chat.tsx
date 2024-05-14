import { Flex, Show } from "@chakra-ui/react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { MessageContainer } from "../../components/Message/MessageContainer";
import { SidebarDrawer } from "../../components/Sidebar/SidebarDrawer";

const ChatPage = () => {
	return (
		<Flex
			bg="primary"
			w="full"
			h="100vh"
			direction={"column"}
			alignItems={"center"}
			justifyContent={{ base: "flex-start", lg: "center" }}
			overflow={"auto"}
			p={{ base: "1", md: "5" }}
		>
			<Flex
				w={{ base: "full", md: "95%", lg: "75%" }}
				h="full"
				borderRadius={"xl"}
				overflow={"hidden"}
				boxShadow={"2xl"}
			>
				<Show below="md">
					<SidebarDrawer />
				</Show>
				<Show above="md">
					<Sidebar />
				</Show>
				<Flex as="main" flex="1" bg="#fffa" p={{ base: "0", md: "6" }}>
					<MessageContainer />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default ChatPage;
