import {
	Flex,
	Avatar,
	Text,
	HStack,
	AvatarGroup,
	IconButton,
	Icon,
} from "@chakra-ui/react";
import { GroupResponse } from "../../api/group.types";
import { getAvatarUrl, getGroupAvatarUrl } from "../../utils/avatar";
import { IoSettings } from "react-icons/io5";
import { useUser } from "../../states/user/useUser";
import { useSelectedContact } from "../../states/user/useSelectedUser";
import { useManageDialog } from "../../states/modal/useManageDialog";

interface GroupProps {
	group: GroupResponse;
}
export const Group = ({ group }: GroupProps) => {
	const { user } = useUser();
	const { selectedGroup, setSelectedGroup } = useSelectedContact();
	const manageGroup = useManageDialog();
	return (
		<Flex
			p="3"
			bg={selectedGroup?.id === group.id ? "white" : undefined}
			boxShadow={selectedGroup?.id === group.id ? "md" : undefined}
			gap={"4"}
			alignItems={"center"}
			cursor={"pointer"}
			borderRadius={"lg"}
			transition={"all 200ms ease-in-out"}
			_hover={{
				bg:
					selectedGroup?.id !== group.id
						? "blackAlpha.100"
						: undefined,
			}}
			onClick={() => {
				setSelectedGroup(group);
			}}
		>
			<Avatar
				name={group.group_name}
				src={getGroupAvatarUrl(group.group_avatar)}
				size={"md"}
				border={"2px solid"}
				borderColor={"black"}
			></Avatar>
			<Flex direction={"column"} flex="1">
				<Text fontWeight={"bold"} fontSize={"sm"}>
					{group.group_name}
				</Text>
				<HStack mt="1">
					<AvatarGroup>
						{group.Members.slice(0, 3).map((member) => (
							<Avatar
								// border={"none"}
								height={"18px"}
								w="18px"
								src={getAvatarUrl(member.user.avatar)}
								name={member.user.displayName}
								key={member.user.id}
							/>
						))}
					</AvatarGroup>
					<Text fontSize={"xs"} color={"gray.500"}>
						{group.Members.length}{" "}
						{group.Members.length == 1 ? "member" : "members"}
					</Text>
				</HStack>
			</Flex>
			{user?.id == group.created_by_id && (
				<IconButton
					aria-label="Manage group"
					size={"xs"}
					variant={"ghost"}
					onClick={() => manageGroup.onOpen(group)}
				>
					<Icon as={IoSettings} />
				</IconButton>
			)}
		</Flex>
	);
};
