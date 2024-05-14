import {
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	ModalProps,
} from "@chakra-ui/react";
import { AvatarInput } from "../Form/AvatarInput";
import { useState } from "react";
import { generateRandomAvatar, getGroupAvatarUrl } from "../../utils/avatar";
import { useCreateGroupMutation } from "../../states/query/group/useCreateGroup";
interface CreateGroupProps extends Omit<ModalProps, "children"> {}

export const CreateGroup = ({ ...props }: CreateGroupProps) => {
	const [avatar, setAvatar] = useState(generateRandomAvatar());
	const [name, setName] = useState("");
	const [error, setError] = useState<string | undefined>(undefined);
	const createGroupMutation = useCreateGroupMutation();

	const handleSubmit = () => {
		if (!name) {
			setError("Please enter name of the group");
			return;
		}

		createGroupMutation.mutate(
			{ name, avatar },
			{
				onSuccess: () => {
					props.onClose();
				},
			}
		);
	};

	return (
		<Modal {...props} motionPreset="slideInTop">
			<ModalOverlay />
			<ModalContent bg="background">
				<ModalHeader>Create Group</ModalHeader>
				<ModalBody>
					<Flex gap={"4"} alignItems={"flex-start"}>
						<AvatarInput
							value={getGroupAvatarUrl(avatar)}
							onChange={setAvatar}
						/>
						<FormControl
							isInvalid={!!error}
							bg="white"
							py="3"
							px="4"
							borderRadius={"xl"}
							boxShadow={"lg"}
							transition={"all 200ms ease-in-out"}
							_focusWithin={{
								boxShadow: "2xl",
							}}
							_disabled={{
								bg: "background",
								shadow: "sm",
							}}
							isDisabled={createGroupMutation.isPending}
						>
							<FormLabel mb="1" fontSize={"xs"}>
								Group Name
							</FormLabel>
							<Flex>
								<Input
									autoComplete={name}
									color={"gray.900"}
									flex={"1"}
									name={"group_name"}
									value={name}
									onChange={(e) => setName(e.target.value)}
									fontSize={"sm"}
									variant={"unstyled"}
									placeholder={"Enter group name here"}
									type={"text"}
								/>
							</Flex>
							{error && (
								<FormErrorMessage fontSize={"xs"}>
									{error}
								</FormErrorMessage>
							)}
						</FormControl>
					</Flex>
				</ModalBody>
				<ModalFooter>
					<ButtonGroup>
						<Button
							variant={"ghost"}
							onClick={props.onClose}
							isDisabled={createGroupMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							colorScheme="primary"
							boxShadow={"lg"}
							onClick={handleSubmit}
							isLoading={createGroupMutation.isPending}
						>
							Create
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
