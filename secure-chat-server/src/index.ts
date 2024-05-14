import http from "http";
import https from "https";
import app from "./app";
import fs from "fs";
import path from "path";
import _ from "lodash";
import initializeChatSocket from "./routes/socket.route";

const options =
	process.env.NODE_ENV === "production"
		? {}
		: {
				key: fs.readFileSync(path.join(__dirname, "server-key.pem")),
				cert: fs.readFileSync(path.join(__dirname, "server.pem")),
		  };

const server =
	process.env.NODE_ENV === "production"
		? http.createServer(app)
		: https.createServer(options, app);

const CurrentOnline = new Map<string, string>();

initializeChatSocket(server, CurrentOnline);

const port = process.env.PORT || 5000;
server.listen(port, () => {
	console.log(`Listening: https://localhost:${port}`);
});
