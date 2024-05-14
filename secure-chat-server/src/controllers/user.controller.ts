import prisma from "../utils/prisma.config";
import bcrypt from "bcrypt";
import _ from "lodash";

interface UserRegisterProps {
	avatar: string;
	displayName: string;
	username: string;
	password: string;
}
const register = async ({
	avatar,
	displayName,
	username,
	password,
}: UserRegisterProps) => {
	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			displayName,
			avatar,
			username,
			password: hashedPassword,
			pubKey: "",
		},
	});

	return _.omit(user, "password");
};

interface UserLoginProps {
	username: string;
	password: string;
}

const login = async ({ username, password }: UserLoginProps) => {
	const user = await prisma.user.findUnique({ where: { username } });

	if (!user) {
		throw new Error("User not found");
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		throw new Error("Invalid password");
	}

	return _.omit(user, "password");
};

interface UserCurrentProps {
	id: string;
}

const currentUser = async ({ id }: UserCurrentProps) => {
	const user = await prisma.user.findUnique({ where: { id } });

	if (!user) {
		throw new Error("User not found");
	}

	return _.omit(user, "password");
};

const updatePublicKey = async (userId: string, publicKey: string) => {
	const user = await prisma.user.update({
		where: { id: userId },
		data: { pubKey: publicKey },
	});
	return user;
};

const getUser = async (userId: string) => {
	return await prisma.user.findUnique({ where: { id: userId } });
};

const setOnlineStatus = async (userId: string, status: boolean) => {
	return await prisma.user.update({
		where: { id: userId },
		data: { isOnline: status },
	});
};

const UserController = {
	register,
	login,
	getUser,
	currentUser,
	updatePublicKey,
	setOnlineStatus,
};
export default UserController;
