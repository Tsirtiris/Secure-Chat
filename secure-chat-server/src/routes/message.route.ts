import { Router } from "express";
import MessageHandler from "../api/message.handlers";
import multer from "multer";
import { JWTVerifyMiddleware } from "../middleware/auth.middleware";
import { fileMiddleware } from "../middleware/file.middleware";

const MessageRoute = Router();
MessageRoute.use(JWTVerifyMiddleware);
MessageRoute.post(
	"/file",
	fileMiddleware.single("file"),
	MessageHandler.uploadFile
);
MessageRoute.get("/file/:id", MessageHandler.getFile);
MessageRoute.get("/:id", MessageHandler.getMessages);
export default MessageRoute;
