import { ChatModeType } from "../states/chat/useChatMode";

export interface MessageResponse {
	id: string;
	sender_id: string;
	receiver_id?: string;
	group_id?: string;
	scope: ChatModeType;
	type: MessageType;
	content: string;
	createdAt: string;
	updatedAt: string;
	file?: FileMetadata;
}

export type MessageType = keyof typeof MessageTypes;

export const MessageTypes = {
	PLAIN: "PLAIN",
	FILE: "FILE",
} as const;

export interface FileUploadReturnType {
	id: string;
	sender_id: string;
	receiver_id?: string;
	group_id?: string;
	content: string;
	scope: ChatModeType;
	type: MessageType;
	createdAt: string;
	updatedAt: string;
	file?: FileMetadata;
}

interface FileMetadata {
	id: string;
	originalName: string;
	filename: string;
	size: number;
	mimeType: string;
	message_id: string;
}
