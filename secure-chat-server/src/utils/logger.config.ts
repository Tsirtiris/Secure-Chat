import pino from "pino";
import fs from "fs";

const createLogger = () => {
	if (!fs.existsSync(`${__dirname}/logs/app.log`)) {
		fs.mkdirSync(`${__dirname}/logs`, { recursive: true });
	}

	const transports = pino.transport({
		targets: [
			{
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "SYS:standard",
					ignore: "pid,hostname",
				},
			},
			{
				target: "pino/file",
				options: { destination: __dirname + "/logs/app.log" },
			},
		],
	});
	const logger = pino(transports);
	return logger;
};

const logger = createLogger();
export default logger;
