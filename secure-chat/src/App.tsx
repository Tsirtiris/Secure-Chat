import {
	Button,
	Card,
	CardBody,
	Flex,
	Heading,
	Icon,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react";
import { IoLockClosed } from "react-icons/io5";
import { useCurrentUser } from "./states/query/auth/useCurrentUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKeyExchange } from "./states/key/useKeyExchange";

function App() {
	const navigate = useNavigate();
	const userQuery = useCurrentUser();
	const keyExchange = useKeyExchange();

	useEffect(() => {
		if (userQuery.data && keyExchange.data) {
			navigate("/chat");
		}

		if (userQuery.isError) {
			navigate("/login");
		}
	}, [keyExchange.data, navigate, userQuery.data, userQuery.isError]);

	return (
		<Flex
			w={"full"}
			h="100vh"
			bg="primary"
			alignItems={"center"}
			justifyContent={"center"}
		>
			<Card boxShadow={"xl"}>
				<CardBody>
					<Flex direction={"column"} alignItems={"center"}>
						<Flex gap={"5"}>
							<Icon as={IoLockClosed} fontSize={"5xl"} />
							<Heading>Secure Chat</Heading>
						</Flex>
						{(keyExchange.isFetching || userQuery.isFetching) && (
							<VStack>
								<Spinner mt="5"></Spinner>
								<Text
									mt="2"
									fontWeight={"bold"}
									color={"black"}
								>
									Signing In
								</Text>
							</VStack>
						)}
						{keyExchange.isError && (
							<Flex direction={"column"}>
								<Text>Unable to connect with the server</Text>
								<Button
									size={"sm"}
									mt="3"
									colorScheme={"red"}
									onClick={() => keyExchange.refetch()}
								>
									Retry
								</Button>
							</Flex>
						)}
					</Flex>
				</CardBody>
			</Card>
		</Flex>
	);
}

export default App;
