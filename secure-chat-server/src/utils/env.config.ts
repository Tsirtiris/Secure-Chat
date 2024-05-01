import { configDotenv } from "dotenv";
import * as crypto from "crypto";

configDotenv();

export const JWT_SECRET = process.env.JWT_SECRET;
export const KEY_GEN_PASSWORD = process.env.KEY_GEN_PASSWORD;
export const AES_PASSWORD = process.env.AES_ENCRYPTION_PASSWORD;
export const IV_PASSWORD = Buffer.from(
	process.env.IV_PASSWORD ?? crypto.randomBytes(16).toString("hex"),
	"hex"
);
