import { Flex, Image, Text } from "@chakra-ui/react";
import { EmptyMessageImg } from "../../assets";

export const EmptyMessages = () => {
	return (
		<Flex
			direction={"column"}
			flex="1"
			alignItems={"center"}
			justifyContent={"center"}
		>
			<Image src={EmptyMessageImg} w="40%" />
			<Text mt="5" color={"gray.700"}>
				You have no conversation with John.
			</Text>
			<Text mt="1" fontWeight={"bold"} fontSize={"xl"}>
				Start by saying "Hi"
			</Text>
		</Flex>
	);
};
