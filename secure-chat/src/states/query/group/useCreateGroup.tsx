import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateGroupProps } from "../../../api/group.types";
import GroupAPI from "../../../api/group";
import { useToast } from "@chakra-ui/react";
import { GET_GROUPS } from "./useGroups";
import { AxiosError } from "axios";

export const CREATE_GROUP = "CREATE_GROUP";
export const useCreateGroupMutation = () => {
	const client = useQueryClient();
	const toast = useToast();
	const mutation = useMutation({
		mutationKey: [CREATE_GROUP],
		mutationFn: (data: CreateGroupProps) => GroupAPI.createGroup(data),
		onSuccess: () => {
			toast({
				title: "Group created successfully",
				status: "success",
			});
			client.invalidateQueries({
				queryKey: [GET_GROUPS],
			});
		},
		onError: (error) => {
			const message = "Unable to create group";
			let desc = error.message;
			if (error instanceof AxiosError) {
				desc = error.response?.data?.message;
			}

			toast({
				title: message,
				description: desc,
				status: "error",
			});
		},
	});
	return mutation;
};
