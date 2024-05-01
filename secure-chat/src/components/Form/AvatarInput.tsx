import { Avatar, Box, Icon, IconButton } from "@chakra-ui/react";
import { generateRandomAvatar } from "../../utils/avatar";
import { IoShuffle } from "react-icons/io5";

interface AvatarInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export const AvatarInput = ({
	value,
	placeholder,
	onChange,
}: AvatarInputProps) => {
	return (
		<Box position={"relative"}>
			<Avatar
				shadow={"md"}
				border={"3px solid"}
				size={"lg"}
				name={placeholder}
				borderColor={"gray.900"}
				src={"https://api.dicebear.com/8.x/fun-emoji/svg?seed=" + value}
			></Avatar>
			<IconButton
				border={"2px solid"}
				borderColor={"background"}
				pos={"absolute"}
				bottom={"0"}
				right={"0"}
				colorScheme="primary"
				size={"xs"}
				borderRadius={"full"}
				aria-label={""}
				onClick={() => onChange(generateRandomAvatar())}
			>
				<Icon as={IoShuffle}></Icon>
			</IconButton>
		</Box>
	);
};
