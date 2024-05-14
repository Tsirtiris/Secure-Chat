import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../user/useUser";
import GroupAPI from "../../../api/group";

export const GET_GROUPS = "GET_GROUPS";
export const useGroups = () => {
	const { user } = useUser();
	const query = useQuery({
		queryKey: [GET_GROUPS, user?.id],
		queryFn: () => GroupAPI.getGroups(),
	});

	return query;
};
