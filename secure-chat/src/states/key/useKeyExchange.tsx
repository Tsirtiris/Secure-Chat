import { useQuery } from "@tanstack/react-query";
import AuthAPI from "../../api/auth";
import { useEffect } from "react";
import { useServerKey } from "./useServerKey";

const KEY_EXCHANGE = "KEY_EXCHANGE";

export const useKeyExchange = () => {
	const { setServerKey } = useServerKey();
	const query = useQuery({
		queryKey: [KEY_EXCHANGE],
		queryFn: () => AuthAPI.exchangeKey(),
	});

	useEffect(() => {
		if (query.data) {
			setServerKey(query.data);
		}
	}, [query.data, setServerKey]);

	return query;
};
