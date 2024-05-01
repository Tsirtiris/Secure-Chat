import { Router } from "express";
import { JWTVerifyMiddleware } from "../middleware/auth.middleware";
import ContactHandlers from "../api/contact.handlers";

const ContactRoute = Router();
ContactRoute.use(JWTVerifyMiddleware);
ContactRoute.post("/add", ContactHandlers.addContact);
ContactRoute.get("/", ContactHandlers.getContacts);
export default ContactRoute;
