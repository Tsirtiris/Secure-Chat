export interface GroupResponse {
	id: string;
	group_name: string;
	group_avatar: string;
	created_by_id: string;
	createdAt: string;
	updatedAt: string;
	_count: {
		Members: number;
	};
	Members: GroupMemberResponse[];
}

export interface GroupMemberResponse {
	user: {
		id: string;
		avatar: string;
		displayName: string;
		username: string;
	};
}

export interface CreateGroupProps {
	name: string;
	avatar: string;
}

export interface AddMemberToGroupProps {
	username: string;
	groupId: string;
}

export interface RemoveMemberFromGroupProps {
	memberId: string;
	groupId: string;
}
