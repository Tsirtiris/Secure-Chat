import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ValidationError } from "yup";
import logger from "../utils/logger.config";

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	logger.error(err);
	let errorHandler = new ErrorHandler();
	let error: ErrorResponse;
	if (err instanceof ValidationError) {
		error = {
			type: "VALIDATION_ERROR",
			error: errorHandler.handleValidationError(err),
		};
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		error = {
			type: "GENERAL_ERROR",
			error: errorHandler.handleKnownPrismaError(err),
		};
	} else if (err instanceof CustomError) {
		error = {
			type: "CUSTOM_ERROR",
			error: errorHandler.handleCustomError(err),
		};
	} else {
		error = {
			type: "GENERAL_ERROR",
			error: {
				message: err.message,
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
			},
		};
	}

	res.status(error.error.statusCode);
	res.json(error);
}

class ErrorHandler {
	handleCustomError(error: CustomError): CustomErrorResponse {
		return {
			field: error.field,
			desc: error.desc,
			message: error.message,
			statusCode: error.statusCode,
		};
	}
	handleValidationError(error: ValidationError): ValidationErrorResponse {
		return {
			field: error.path,
			message: error.message,
			statusCode: StatusCodes.BAD_REQUEST,
		};
	}
	handleKnownPrismaError(
		error: Prisma.PrismaClientKnownRequestError
	): GeneralErrorResponse {
		return {
			message: this.getPrismaUserMessages(error),
			statusCode: StatusCodes.NOT_ACCEPTABLE,
		};
	}

	getPrismaUserMessages(error: Prisma.PrismaClientKnownRequestError) {
		let message = "Unknown error";
		switch (error.code) {
			case "P2002":
				let modelName = error.meta?.modelName;
				message = `${modelName} already exists`;
				break;
			case "P2003":
				message = "Invalid foreign key reference";
				break;
			case "P2004":
				message = "Constraint violation on the field";
				break;
			case "P2005":
				message = "Value too long for the database column";
				break;
			case "P2006":
				message = "Incorrect value for data type";
				break;
			case "P2007":
				message = "Data validation error due to field constraints";
				break;
		}
		return message;
	}
}

interface GeneralErrorResponse {
	statusCode: number;
	message: string;
	desc?: string;
}

interface ValidationErrorResponse extends GeneralErrorResponse {
	field?: string;
}

type CustomErrorResponse = ValidationErrorResponse & GeneralErrorResponse;

type ErrorResponse =
	| {
			type: "GENERAL_ERROR";
			error: GeneralErrorResponse;
	  }
	| {
			type: "VALIDATION_ERROR";
			error: ValidationErrorResponse;
	  }
	| {
			type: "CUSTOM_ERROR";
			error: CustomErrorResponse;
	  };

class CustomError extends Error {
	public statusCode: StatusCodes;
	public desc?: string;
	public field?: string;
	constructor({
		message,
		statusCode,
		field,
		desc,
	}: {
		message: string;
		statusCode: StatusCodes;
		field?: string;
		desc?: string;
	}) {
		super(message);
		this.statusCode = statusCode;
		this.field = field;
		this.desc = desc;
	}
}

export { CustomError };
