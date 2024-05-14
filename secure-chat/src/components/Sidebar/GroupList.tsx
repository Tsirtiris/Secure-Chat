import { Flex, Spinner, Icon, Button, Text } from "@chakra-ui/react";
import { IoWarning, IoRefreshCircle, IoPeopleOutline } from "react-icons/io5";
import { useGroups } from "../../states/query/group/useGroups";
import { Group } from "./Group";
import { useManageDialog } from "../../states/modal/useManageDialog";
import { ManageGroupDialog } from "../Group/ManageGroup";

export const GroupList = () => {
	const manageDialog = useManageDialog();
	const groupQuery = useGroups();

	if (groupQuery.isLoading) {
		return (
			<Flex
				direction={"column"}
				alignItems={"center"}
				p="5"
				justifyContent={"center"}
				w="full"
			>
				<Spinner />
				<Text fontSize={"xs"} mt="4">
					Loading Groups
				</Text>
			</Flex>
		);
	}

	if (groupQuery.isError) {
		return (
			<Flex
				direction={"column"}
				p="3"
				bg="white"
				boxShadow={"md"}
				h="min-content"
				w="full"
				borderRadius={"md"}
				alignItems={"center"}
			>
				<Icon as={IoWarning} fontSize={"5xl"} color={"red.500"} />
				<Text textAlign={"center"} fontSize={"sm"} mt="3">
					Unable to load Groups
				</Text>
				<Button
					mt="6"
					colorScheme="red"
					borderRadius={"lg"}
					fontWeight={"normal"}
					onClick={() => groupQuery.refetch()}
					isLoading={groupQuery.isRefetching}
					leftIcon={<Icon as={IoRefreshCircle} />}
					size={"sm"}
				>
					Retry
				</Button>
			</Flex>
		);
	}

	if (!groupQuery.data || groupQuery.data.length == 0) {
		return (
			<Flex
				direction={"column"}
				p="3"
				bg="white"
				boxShadow={"md"}
				h="min-content"
				w="full"
				borderRadius={"md"}
				alignItems={"center"}
			>
				<Icon as={IoPeopleOutline} fontSize={"5xl"} color={"primary"} />
				<Text textAlign={"center"} fontSize={"sm"} mt="3">
					You are not a member of <br></br> any group yet
				</Text>
			</Flex>
		);
	}
	return (
		<>
			{manageDialog.group !== undefined && (
				<ManageGroupDialog
					{...manageDialog}
					group={manageDialog.group}
				/>
			)}
			<Flex
				flex="1"
				direction={"column"}
				overflow={"auto"}
				gap={"2"}
				sx={{
					"&::-webkit-scrollbar": {
						width: "8px",
						height: "8px",
					},
					"&::-webkit-scrollbar-track": {
						borderRadius: "5px",
						backgroundColor: "gray.100", // Use Chakra UI theme colors
					},
					"&::-webkit-scrollbar-thumb": {
						borderRadius: "9px",
						backgroundColor: "gray.400", // Use Chakra UI theme colors
						transition: "all 300ms",
					},
					"&::-webkit-scrollbar-thumb:hover": {
						backgroundColor: "primary.700", // Use Chakra UI theme colors
					},
					"&::-webkit-scrollbar-thumb:active": {
						backgroundColor: "primary.800", // Use Chakra UI theme colors
					},
				}}
			>
				{groupQuery.data.map((group) => (
					<Group key={group.id} group={group} />
				))}
			</Flex>
		</>
	);
};
