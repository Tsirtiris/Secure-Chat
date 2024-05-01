import * as openpgp from "openpgp";
import { KEY_GEN_PASSWORD } from "./env.config";

let ServerKeys: openpgp.SerializedKeyPair<string>;

const generateKeys = async () => {
	const keys = await openpgp.generateKey({
		userIDs: [{ name: "Server" }],
		passphrase: KEY_GEN_PASSWORD,
	});
	ServerKeys = keys;
};

generateKeys();

export default function getServerKeys() {
	return new Promise<openpgp.SerializedKeyPair<string>>((resolve, reject) => {
		if (ServerKeys) {
			resolve(ServerKeys);
		} else {
			reject(new Error("ServerKeys not generated yet"));
		}
	});
}
