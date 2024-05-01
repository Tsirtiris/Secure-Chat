import * as openpgp from "openpgp";
import getServerKeys from "./keys.config";
import { AES_PASSWORD, IV_PASSWORD, KEY_GEN_PASSWORD } from "./env.config";
import * as crypto from "crypto";
import UserController from "../controllers/user.controller";

export const decryptMessageFromUser = async (message: string) => {
	const { privateKey: pvtKey } = await getServerKeys();
	const privateKey = await openpgp.decryptKey({
		privateKey: await openpgp.readPrivateKey({ armoredKey: pvtKey }),
		passphrase: KEY_GEN_PASSWORD,
	});
	const { data: decryptedMessage } = await openpgp.decrypt({
		message: await openpgp.readMessage({ armoredMessage: message }),
		decryptionKeys: privateKey,
	});

	return decryptedMessage.toString();
};

export const encryptMessageForUser = async (
	message: string,
	pubKey: string
) => {
	const publicKey = await openpgp.readKey({ armoredKey: pubKey });
	const encrypted = await openpgp.encrypt({
		message: await openpgp.createMessage({ text: message }),
		encryptionKeys: publicKey,
	});

	return encrypted;
};

export const encryptMessageForDatabase = (message: string) => {
	if (!IV_PASSWORD) {
		throw Error("IV Password not found");
	}
	if (!AES_PASSWORD) {
		throw Error("AES Password not found");
	}

	let aesKey = crypto.randomBytes(32).toString("hex").substring(0, 32);
	let encryptedMessage = encryptAES(message, aesKey);
	let encryptedAesKey = encryptAES(aesKey, AES_PASSWORD.substring(0, 32));

	return {
		encryptedMessage: encryptedMessage,
		encryptedAesKey: encryptedAesKey,
	};
};

export const decryptMessageFromDatabase = (message: string, key: string) => {
	if (!AES_PASSWORD) {
		throw Error("AES Password not found");
	}
	if (!IV_PASSWORD) {
		throw Error("IV Password not found");
	}

	let decryptedKey = decryptAES(key, AES_PASSWORD.substring(0, 32));
	let decryptedMessage = decryptAES(message, decryptedKey);

	return decryptedMessage;
};

export const encryptAES = (data: string, key: string) => {
	let cipher = crypto.createCipheriv("aes-256-cbc", key, IV_PASSWORD);
	let encrypted = cipher.update(data, "utf8", "base64");
	encrypted += cipher.final("base64");
	return encrypted;
};

export const decryptAES = (data: string, key: string) => {
	let decipher = crypto.createDecipheriv("aes-256-cbc", key, IV_PASSWORD);
	let decrypted = decipher.update(data, "base64", "utf8");
	return decrypted + decipher.final("utf8");
};
