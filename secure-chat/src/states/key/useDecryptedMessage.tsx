import { useQuery } from "@tanstack/react-query";
import { PRIVATE_KEY, decryptMessage } from "../../utils/key";

export const useDecryptedMessage = (id: string, message: string) => {
	const query = useQuery({
		queryKey: ["DECRYPT", id],
		queryFn: async () => {
			const pvtKey = window.localStorage.getItem(PRIVATE_KEY);
			if (!pvtKey) return "naol";
			const decryptedMessage = await decryptMessage(message, pvtKey);

			return decryptedMessage;
		},
		retry: false,
		refetchOnMount: false,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
	return query;
};
