import { StatusCodes } from "http-status-codes";
import { CustomError } from "../middleware/error.middleware";
import prisma from "../utils/prisma.config";
import UserController from "./user.controller";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

interface createGroupProps {
	userId: string;
	name: string;
	avatar: string;
}
const createGroup = async ({ userId, name, avatar }: createGroupProps) => {
	const group = await prisma.group.create({
		data: {
			group_name: name,
			group_avatar: avatar,
			created_by_id: userId,
			Members: {
				create: {
					userId,
				},
			},
		},
	});

	return group;
};

const getGroups = async (userId: string) => {
	const groups = await prisma.group.findMany({
		where: {
			Members: {
				some: {
					userId,
				},
			},
		},
		include: {
			_count: true,
			Members: {
				select: {
					user: {
						select: {
							id: true,
							avatar: true,
							displayName: true,
							username: true,
						},
					},
				},
			},
		},
	});

	return groups;
};

interface addContactProps {
	userId: string;
	username: string;
	groupId: string;
}
export const addContact = async ({
	userId,
	groupId,
	username,
}: addContactProps) => {
	const user = await prisma.user.findUnique({
		where: {
			username: username,
		},
	});

	if (!user) {
		throw new CustomError({
			message: "user not found",
			statusCode: StatusCodes.NOT_FOUND,
		});
	}

	const group = await prisma.group.findUniqueOrThrow({
		where: {
			id: groupId,
		},
	});

	if (group.created_by_id !== userId) {
		throw new CustomError({
			message: "Only owner of the group can add contacts",
			statusCode: StatusCodes.NOT_FOUND,
		});
	}

	const isMember = await prisma.groupMembership.count({
		where: {
			userId: user.id,
			groupId: group.id,
		},
	});

	if (isMember > 0) {
		throw new CustomError({
			message: "user already a member",
			statusCode: StatusCodes.CONFLICT,
		});
	}

	const groupMembership = await prisma.groupMembership.create({
		data: {
			userId: user.id,
			groupId: group.id,
		},
	});

	return groupMembership;
};

interface removeContactProps {
	userId: string;
	groupId: string;
	memberId: string;
}
const removeContact = async ({
	userId,
	groupId,
	memberId,
}: removeContactProps) => {
	const group = await prisma.group.findUniqueOrThrow({
		where: {
			id: groupId,
		},
	});

	if (group.created_by_id !== userId && memberId !== userId) {
		throw new CustomError({
			message: "Only owner of the group can remove contacts",
			statusCode: StatusCodes.NOT_FOUND,
		});
	}
	const membership = await prisma.groupMembership.delete({
		where: {
			userId_groupId: {
				userId: memberId,
				groupId: groupId,
			},
		},
	});
	return membership;
};

const getMembers = async (groupId: string) => {
	const members = await prisma.group.findFirst({
		where: {
			id: groupId,
		},
		include: {
			Members: {
				include: {
					user: true,
				},
			},
		},
	});

	return members?.Members.map((member) => member.user) ?? [];
};

const GroupController = {
	createGroup,
	getGroups,
	addContact,
	removeContact,
	getMembers,
};
export default GroupController;
