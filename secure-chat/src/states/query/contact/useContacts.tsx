import { useQuery } from "@tanstack/react-query";
import ContactAPI from "../../../api/contact";

export const GET_CONTACTS = "GET_CONTACTS";
export const useContacts = () =>
	useQuery({
		queryKey: [GET_CONTACTS],
		queryFn: () => ContactAPI.getContacts(),
	});
