import { Router } from "express";
import MessageHandler from "../api/message.handlers";
import { JWTVerifyMiddleware } from "../middleware/auth.middleware";

const MessageRoute = Router();
MessageRoute.use(JWTVerifyMiddleware);
MessageRoute.get("/:id", MessageHandler.getMessages);
export default MessageRoute;
