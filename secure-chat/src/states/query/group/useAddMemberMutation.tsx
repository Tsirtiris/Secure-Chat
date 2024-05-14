import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddMemberToGroupProps } from "../../../api/group.types";
import GroupAPI from "../../../api/group";
import { useToast } from "@chakra-ui/react";
import { GET_GROUPS } from "./useGroups";
import { AxiosError } from "axios";
import { GET_MEMBERS } from "./useMembers";

export const ADD_MEMBER = "ADD_MEMBER";
export const useAddMemberMutation = () => {
	const client = useQueryClient();
	const toast = useToast();
	const mutation = useMutation({
		mutationKey: [ADD_MEMBER],
		mutationFn: (data: AddMemberToGroupProps) => GroupAPI.addMember(data),
		onSuccess: () => {
			toast({
				title: "Member added",
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
				title: "Error adding member",
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
