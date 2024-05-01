import express from "express";
import helmet from "helmet";
import cors from "cors";
import https from "https";

import * as middlewares from "./middleware/middlewares";
import AuthRoute from "./routes/auth.route";
import { errorHandler } from "./middleware/error.middleware";
import morgan from "morgan";
import ContactRoute from "./routes/contact.route";
import MessageRoute from "./routes/message.route";
import KeyRoute from "./routes/keys.route";

require("dotenv").config();
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(
	cors({
		origin: "*",
	})
);
app.use(express.json());

app.get("/", (req, res) => {
	return res.json({});
});

app.use(AuthRoute);
app.use(KeyRoute);
app.use("/contact", ContactRoute);
app.use("/message", MessageRoute);

app.use(middlewares.notFound);
app.use(errorHandler);

export default app;
