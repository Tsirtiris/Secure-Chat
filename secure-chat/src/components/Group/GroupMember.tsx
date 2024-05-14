import { Avatar, Flex, HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import { GroupMemberResponse } from "../../api/group.types";
import { IoRemoveCircle } from "react-icons/io5";
import { getAvatarUrl } from "../../utils/avatar";
import { useRemoveMemberMutation } from "../../states/query/group/useRemoveMemberMutation";
import { useSelectedContact } from "../../states/user/useSelectedUser";

interface GroupMemberProps {
	member: GroupMemberResponse["user"];
}
export const GroupMember = ({ member }: GroupMemberProps) => {
	const { selectedGroup } = useSelectedContact();
	const remove = useRemoveMemberMutation();
	const handleRemove = () => {
		remove.mutate({
			groupId: selectedGroup?.id ?? "",
			memberId: member.id,
		});
	};

	return (
		<HStack key={member.id} gap={"3"} p="2">
			<Avatar size={"sm"} src={getAvatarUrl(member.avatar)} />
			<Flex direction={"column"} flex={"1"}>
				<Text fontWeight={"bold"}>{member.displayName}</Text>
				<Text fontWeight={"400"} color={"gray.600"}>
					{member.username}
				</Text>
			</Flex>
			<IconButton
				onClick={handleRemove}
				isLoading={remove.isPending}
				size={"sm"}
				colorScheme="red"
				variant="ghost"
				aria-label="remove member"
				icon={<Icon as={IoRemoveCircle} />}
			></IconButton>
		</HStack>
	);
};
