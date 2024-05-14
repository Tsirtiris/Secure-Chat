import {
	Avatar,
	Flex,
	HStack,
	Heading,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	ModalProps,
	Text,
	VStack,
} from "@chakra-ui/react";
import { GroupResponse } from "../../api/group.types";
import { getGroupAvatarUrl } from "../../utils/avatar";
import { IoPersonAdd } from "react-icons/io5";
import { useAddMemberMutation } from "../../states/query/group/useAddMemberMutation";
import { useState } from "react";
import { MembersList } from "./MembersList";

export interface ManageGroupDialogProps extends Omit<ModalProps, "children"> {
	group: GroupResponse;
}

export const ManageGroupDialog = ({
	group,
	...props
}: ManageGroupDialogProps) => {
	const addMember = useAddMemberMutation();
	const [username, setUsername] = useState("");

	const handleAddMember = () => {
		addMember.mutate({
			groupId: group.id,
			username,
		});
	};

	return (
		<Modal {...props} motionPreset="slideInTop">
			<ModalOverlay />
			<ModalContent bg="background">
				<ModalCloseButton />
				<ModalHeader>
					<HStack alignItems={"flex-start"} gap={"5"}>
						<Avatar
							src={getGroupAvatarUrl(group.group_avatar)}
							border={"2px solid"}
							boxShadow={"lg"}
						/>
						<VStack alignItems={"flex-start"} gap={"0"}>
							<Heading fontSize={"2xl"} mb="0">
								{group.group_name}
							</Heading>
							<Text color={"gray.700"} fontSize={"md"}>
								{group.Members.length} Members
							</Text>
						</VStack>
					</HStack>
				</ModalHeader>
				<ModalBody>
					<Heading fontSize={"lg"} mb="3">
						Members
					</Heading>
					<Flex mb="3">
						<InputGroup>
							<Input
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								bg="white"
								placeholder="Add member to group"
								fontSize={"sm"}
								isDisabled={addMember.isPending}
							/>
							<InputRightElement>
								<IconButton
									onClick={handleAddMember}
									isLoading={addMember.isPending}
									variant={"solid"}
									colorScheme={"primary"}
									aria-label="add member"
									size={"sm"}
									icon={<Icon as={IoPersonAdd} />}
								/>
							</InputRightElement>
						</InputGroup>
					</Flex>
					<MembersList />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
