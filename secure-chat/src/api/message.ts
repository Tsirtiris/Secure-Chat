import { AxiosProgressEvent } from "axios";
import { axiosWithToken } from "../utils/api";
import { FileUploadReturnType, MessageResponse } from "./message.types";

const getMessages = async (contactId: string) => {
	const messages = await axiosWithToken()
		.get<MessageResponse[]>("/message/" + contactId)
		.then((res) => res.data);

	return messages;
};

const getGroupMessages = async (groupId: string) => {
	const messages = await axiosWithToken()
		.get<MessageResponse[]>(`/group/${groupId}/messages`)
		.then((res) => res.data);
	return messages;
};

const uploadFile = async (
	formData: FormData,
	progressCallback: (progressEvent: AxiosProgressEvent) => void
) => {
	const message = await axiosWithToken()
		.post<FileUploadReturnType>("/message/file", formData, {
			onUploadProgress(progressEvent) {
				progressCallback(progressEvent);
			},
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => res.data);
	return message;
};

const downloadFile = async (
	messageId: string,
	filename: string,
	progressCallback: (progressEvent: AxiosProgressEvent) => void
) => {
	await axiosWithToken()
		.get("/message/file/" + messageId, {
			onDownloadProgress(progressEvent) {
				progressCallback(progressEvent);
			},
			responseType: "blob",
		})
		.then((res) => {
			const href = URL.createObjectURL(res.data);
			// create "a" HTML element with href to file & click
			const link = document.createElement("a");
			link.href = href;
			link.setAttribute("download", filename); //or any other extension
			document.body.appendChild(link);
			link.click();

			// clean up "a" element & remove ObjectURL
			document.body.removeChild(link);
			URL.revokeObjectURL(href);
		});
};

const MessageAPI = {
	getMessages,
	getGroupMessages,
	uploadFile,
	downloadFile,
};
export default MessageAPI;
