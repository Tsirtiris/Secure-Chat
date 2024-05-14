import { Request } from "express";
import { Multer } from "multer";

export interface RequestWithUser extends Request {
	userId?: string;
}

export interface RequestWithFile extends RequestWithUser {
	file?: Express.Multer.File;
}
