import { axiosWithToken } from "../utils/api";
import { MessageResponse } from "./message.types";

const getMessages = async (contactId: string) => {
	const messages = await axiosWithToken()
		.get<MessageResponse[]>("/message/" + contactId)
		.then((res) => res.data);

	return messages;
};
const MessageAPI = {
	getMessages,
};
export default MessageAPI;
