import { useMutation, useQueryClient } from "@tanstack/react-query";
import ContactAPI from "../../../api/contact";
import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../types/ErrorResponse";
import { GET_CONTACTS } from "./useContacts";

export const ADD_CONTACT = "ADD_CONTACT";
export const useAddContactMutation = () => {
	const toast = useToast();
	const client = useQueryClient();
	const mutation = useMutation({
		mutationKey: [ADD_CONTACT],
		mutationFn: (username: string) => ContactAPI.addContact(username),
		onSuccess: () => {
			client.invalidateQueries({
				queryKey: [GET_CONTACTS],
			});
			toast({
				status: "success",
				title: "Contact added",
				isClosable: true,
				position: "bottom-left",
			});
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				const response = error?.response?.data as ErrorResponse;
				toast({
					status: "error",
					title: "Unable to add contact",
					description: response.error.message,
					isClosable: true,
					position: "bottom-left",
				});
			}
		},
	});
	return mutation;
};
