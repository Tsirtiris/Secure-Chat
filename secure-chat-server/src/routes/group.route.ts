import { Router } from "express";
import { JWTVerifyMiddleware } from "../middleware/auth.middleware";
import GroupHandler from "../api/group.handler";

const GroupRoute = Router();
GroupRoute.use(JWTVerifyMiddleware);

GroupRoute.get("/", GroupHandler.getGroups);
GroupRoute.post("/create", GroupHandler.createGroup);
GroupRoute.put("/add-contact", GroupHandler.addContact);
GroupRoute.put("/remove-contact", GroupHandler.removeContact);
GroupRoute.get("/:id/messages", GroupHandler.getMessages);
GroupRoute.get("/:id/members", GroupHandler.getMembers);

export default GroupRoute;
