import { useMutation } from "@tanstack/react-query";
import { LoginAPIProps } from "../../../api/auth.types";
import { getToken } from "../../../utils/token";
import { useToast } from "@chakra-ui/react";
import AuthAPI from "../../../api/auth";
import { useUser } from "../../user/useUser";

export const LOGIN = "LOGIN";
export const useLoginMutation = () => {
	const { setUser } = useUser();
	const { setToken } = getToken();
	const toast = useToast();
	const mutation = useMutation({
		mutationKey: [LOGIN],
		mutationFn: (data: LoginAPIProps) => AuthAPI.login(data),
		onSuccess: (data) => {
			setToken(data.token);
			setUser(data.user);
			toast({
				position: "top",
				status: "success",
				title: "Login Success",
				duration: 3000,
				isClosable: true,
			});
		},
	});
	return mutation;
};
