import { useQuery } from "@tanstack/react-query";
import GroupAPI from "../../../api/group";

export const GET_MEMBERS = "GET_MEMBERS";
export const useMembers = (groupId: string) => {
	const query = useQuery({
		queryKey: [GET_MEMBERS, groupId],
		queryFn: () => GroupAPI.getMembers(groupId),
	});

	return query;
};
