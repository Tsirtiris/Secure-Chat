import {
	Alert,
	AlertIcon,
	AlertTitle,
	Button,
	Divider,
	Flex,
	Spinner,
} from "@chakra-ui/react";
import { useMembers } from "../../states/query/group/useMembers";
import { useSelectedContact } from "../../states/user/useSelectedUser";
import { GroupMember } from "./GroupMember";

export const MembersList = () => {
	const { selectedGroup } = useSelectedContact();
	const membersQuery = useMembers(selectedGroup?.id ?? "");

	if (membersQuery.isLoading) {
		return (
			<Flex h="200px" alignItems={"center"} justifyContent={"center"}>
				<Spinner />
			</Flex>
		);
	}

	if (membersQuery.isError) {
		return (
			<Alert>
				<AlertIcon />
				<AlertTitle>Unable to load your contacts</AlertTitle>
				<Button
					size={"sm"}
					onClick={() => membersQuery.refetch()}
					isLoading={membersQuery.isRefetching}
				>
					Retry
				</Button>
			</Alert>
		);
	}

	return (
		<Flex direction={"column"} gap={"1"}>
			{membersQuery.data &&
				membersQuery?.data.map((member, index, array) => (
					<>
						<GroupMember member={member} key={member.id} />
						{index < array.length - 1 && (
							<Divider borderColor="gray.300" />
						)}
					</>
				))}
		</Flex>
	);
};
