import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../routes/route.types";
import { CustomError } from "../middleware/error.middleware";
import { StatusCodes } from "http-status-codes";
import ContactsController from "../controllers/contact.controller";

const addContact = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const { username } = req.body;

		if (!username) {
			throw new CustomError({
				message: "Username missing.",
				statusCode: StatusCodes.BAD_REQUEST,
			});
		}
		await ContactsController.AddContact({
			userId: req.userId ?? "o",
			username,
		});

		return res
			.json({
				message: "Contact added successfully",
			})
			.status(StatusCodes.OK);
	} catch (err) {
		next(err);
	}
};

const getContacts = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const contacts = await ContactsController.getContacts(
			req.userId ?? "0"
		);
		return res.json(contacts).status(StatusCodes.OK);
	} catch (error) {
		next(error);
	}
};

const ContactHandlers = {
	addContact,
	getContacts,
};
export default ContactHandlers;
