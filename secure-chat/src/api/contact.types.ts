export interface ContactResponse {
	id: string;
	displayName: string;
	username: string;
	avatar: string;
	pubKey?: string;
	isOnline: boolean;
	createdAt: string;
	updatedAt: string;
	isTyping?: boolean;
}
