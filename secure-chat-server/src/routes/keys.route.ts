import { NextFunction, Response, Router } from "express";
import { JWTVerifyMiddleware } from "../middleware/auth.middleware";
import { RequestWithUser } from "./route.types";
import getServerKeys from "../utils/keys.config";
import UserController from "../controllers/user.controller";

const KeyRoute = Router();
KeyRoute.use(JWTVerifyMiddleware);
KeyRoute.post(
	"/key-exchange",
	async (req: RequestWithUser, res: Response, next: NextFunction) => {
		try {
			const { pubKey } = req.body as { pubKey?: string };

			if (!pubKey) {
				throw new Error("No public key provided");
			}

			if (!pubKey.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----")) {
				throw new Error("Invalid Public key");
			}

			const userId = req.userId!;
			const serverPublicKey = await getServerKeys();
			await UserController.updatePublicKey(userId, pubKey);
			return res.json(serverPublicKey.publicKey);
		} catch (error) {
			next(error);
		}
	}
);

export default KeyRoute;
