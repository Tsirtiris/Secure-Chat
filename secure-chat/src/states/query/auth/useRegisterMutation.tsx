import { useMutation } from "@tanstack/react-query";
import { RegisterAPIProps } from "../../../api/auth.types";
import AuthAPI from "../../../api/auth";
import { useToast } from "@chakra-ui/react";
import { getToken } from "../../../utils/token";
import { useUser } from "../../user/useUser";

export const REGISTER = "REGISTER";
export const useRegisterMutation = () => {
	const toast = useToast();
	const { setToken } = getToken();
	const { setUser } = useUser();

	const mutation = useMutation({
		mutationKey: [REGISTER],
		mutationFn: async (data: RegisterAPIProps) => AuthAPI.register(data),
		onSuccess: (data) => {
			setToken(data.token);
			setUser(data.user);
			toast({
				title: "Welcome to SecureChat",
				status: "success",
				isClosable: true,
				position: "top",
			});
		},
	});

	return mutation;
};
