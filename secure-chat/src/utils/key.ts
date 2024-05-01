import * as openpgp from "openpgp";
const KEY = import.meta.env.VITE_KEY_PASSPHRASE;

export const PRIVATE_KEY = "pvtKey";
export const PUBLIC_KEY = "pubKey";

const generateKey = async (token: string) => {
	const { publicKey, privateKey } = await openpgp.generateKey({
		userIDs: [{ name: token }],
		passphrase: KEY,
	});

	window.localStorage.setItem(PUBLIC_KEY, publicKey);
	window.localStorage.setItem(PRIVATE_KEY, privateKey);
	return { publicKey, privateKey };
};

const getKeys = async (token: string) => {
	let publicKey = window.localStorage.getItem(PUBLIC_KEY);
	let privateKey = window.localStorage.getItem(PRIVATE_KEY);

	if (!privateKey || !publicKey) {
		const keys = await generateKey(token);
		privateKey = keys.privateKey;
		publicKey = keys.publicKey;
	}

	return { privateKey, publicKey };
};

const removeKeys = () => {
	window.localStorage.removeItem(PUBLIC_KEY);
	window.localStorage.removeItem(PRIVATE_KEY);
};

const encryptMessage = async (message: string, pubKey: string) => {
	const publicKey = await openpgp.readKey({ armoredKey: pubKey });
	const encrypted = await openpgp.encrypt({
		message: await openpgp.createMessage({ text: message }),
		encryptionKeys: publicKey,
	});

	return encrypted;
};

const decryptMessage = async (encryptedMessage: string, pvtKey: string) => {
	const privateKey = await openpgp.decryptKey({
		privateKey: await openpgp.readPrivateKey({ armoredKey: pvtKey }),
		passphrase: KEY,
	});

	const decrypted = await openpgp.decrypt({
		message: await openpgp.readMessage({
			armoredMessage: encryptedMessage,
		}),
		decryptionKeys: privateKey,
		config: {
			allowInsecureDecryptionWithSigningKeys: true,
		},
	});

	return decrypted.data.toString();
};

export { generateKey, removeKeys, getKeys, encryptMessage, decryptMessage };
