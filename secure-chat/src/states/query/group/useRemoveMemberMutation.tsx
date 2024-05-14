import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RemoveMemberFromGroupProps } from "../../../api/group.types";
import GroupAPI from "../../../api/group";
import { useToast } from "@chakra-ui/react";
import { GET_GROUPS } from "./useGroups";
import { AxiosError } from "axios";
import { GET_MEMBERS } from "./useMembers";

export const REMOVE_MEMBER = "REMOVE_MEMBER";
export const useRemoveMemberMutation = () => {
	const client = useQueryClient();
	const toast = useToast();
	const mutation = useMutation({
		mutationKey: [REMOVE_MEMBER],
		mutationFn: (data: RemoveMemberFromGroupProps) =>
			GroupAPI.removeMember(data),
		onSuccess: () => {
			toast({
				title: "Member Removed",
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
			client.invalidateQueries({
				queryKey: [GET_GROUPS],
			});
			client.invalidateQueries({
				queryKey: [GET_MEMBERS],
			});
		},
		onError: (error) => {
			let message = error.message;
			if (error instanceof AxiosError && error.response) {
				message = error.response.data.error.message;
			}
			toast({
				title: "Error removing member",
				description: message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
		},
	});

	return mutation;
};
