import { axiosWithToken } from "../utils/api";
import { ContactResponse } from "./contact.types";

const getContacts = async () => {
	const contacts = await axiosWithToken()
		.get<ContactResponse[]>("/contact")
		.then((res) => res.data);
	return contacts;
};

const addContact = async (username: string) => {
	const response = await axiosWithToken()
		.post("/contact/add", { username })
		.then((res) => res.data);

	return response;
};

const ContactAPI = {
	getContacts,
	addContact,
};
export default ContactAPI;
