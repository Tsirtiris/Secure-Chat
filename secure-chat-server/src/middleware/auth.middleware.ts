import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { RequestWithUser } from "../routes/route.types";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const JWT_KEY = process.env.JWT_SECRET;
export const signJWT = async (userId: string) => {
	if (!JWT_KEY) {
		throw Error("JWT Secret Key not found");
	}

	const token = sign({ userId }, JWT_KEY);
	return token;
};

export const verifyJWT = (token: string) => {
	if (!JWT_KEY) {
		throw Error("JWT Secret Key not found");
	}
	const { userId } = verify(token, JWT_KEY) as { userId: string };
	return userId;
};

export const JWTVerifyMiddleware = (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const auth = req.headers["authorization"];

	if (!auth) {
		next(new Error("Authentication Header Not Found"));
		return;
	}

	const token = auth.toString().split(" ")[1] ?? undefined;

	if (!token) {
		next(new Error("Token not found"));
		return;
	}

	const userId = verifyJWT(token);

	if (userId) {
		req["userId"] = userId;
		next();
		return;
	}

	next(new Error("Invalid Token"));
};

export interface SocketWithToken
	extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> {
	userId?: string;
}

export const SocketJWTMiddleware = async (
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
	next: (err?: any) => void
) => {
	try {
		const token = socket.handshake.auth.token;
		if (!token) {
			throw new Error("Token Not found");
		}

		let userId = verifyJWT(token);
		(socket as SocketWithToken).userId = userId;
		return next();
	} catch (error) {
		next(error);
	}
};
