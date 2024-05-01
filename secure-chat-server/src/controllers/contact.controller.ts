import { StatusCodes } from "http-status-codes";
import { CustomError } from "../middleware/error.middleware";
import prisma from "../utils/prisma.config";
import _ from "lodash";

interface AddContactProps {
	userId: string;
	username: string;
}
const AddContact = async ({ userId, username }: AddContactProps) => {
	const contact = await prisma.user.findUnique({
		where: { username },
	});

	if (!contact) {
		throw new CustomError({
			message: "User not found",
			statusCode: StatusCodes.NOT_FOUND,
		});
	}

	if (contact.id === userId) {
		throw new CustomError({
			message: "You can't add yourself as a contact",
			statusCode: StatusCodes.NOT_FOUND,
		});
	}

	const count = await prisma.contact.count({
		where: {
			user_id: userId,
			contact_id: contact.id,
		},
	});

	if (count > 0) {
		throw new CustomError({
			message: "Contact already added",
			statusCode: StatusCodes.NOT_ACCEPTABLE,
		});
	}

	const createdContact = await prisma.contact.create({
		data: {
			user_id: userId,
			contact_id: contact.id,
		},
	});

	return createdContact;
};

const getContacts = async (userId: string) => {
	const contacts = await prisma.contact.findMany({
		where: {
			user_id: userId,
		},
		include: {
			contact: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return contacts.map((user) => {
		let contact = user.contact;
		return _.omit(contact, ["password", "pvtKey"]);
	});
};

const ContactsController = {
	AddContact,
	getContacts,
};
export default ContactsController;
