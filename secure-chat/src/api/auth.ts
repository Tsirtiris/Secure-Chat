import { axiosInstance, axiosWithToken } from "../utils/api";
import { getKeys } from "../utils/key";
import { getToken } from "../utils/token";
import {
	CurrentUserResponse,
	LoginAPIProps,
	LoginAPIResponse,
	RegisterAPIProps,
	RegisterAPIResponse,
} from "./auth.types";

const login = async ({ username, password }: LoginAPIProps) => {
	const user = await axiosInstance
		.post<LoginAPIResponse>(`/login`, {
			username,
			password,
		})
		.then((res) => res.data);
	return user;
};

const register = async (data: RegisterAPIProps) => {
	const user = await axiosInstance
		.post<RegisterAPIResponse>(`/register`, data)
		.then((res) => res.data);
	return user;
};

const getCurrentUser = async () => {
	const { user } = await axiosWithToken()
		.get<{ user: CurrentUserResponse }>("/me")
		.then((res) => res.data);
	return user;
};

const exchangeKey = async () => {
	const { token } = getToken();
	const { publicKey } = await getKeys(
		token ?? (Math.random() * 10000).toString()
	);
	const serverKey = await axiosWithToken()
		.post<string>("/key-exchange", { pubKey: publicKey })
		.then((res) => res.data);
	return serverKey;
};

const AuthAPI = {
	login,
	register,
	getCurrentUser,
	exchangeKey,
};

export default AuthAPI;
