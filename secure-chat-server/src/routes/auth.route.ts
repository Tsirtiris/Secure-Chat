import { Router } from "express";
import UserHandlers from "../api/user.handlers";
import { JWTVerifyMiddleware } from "../middleware/auth.middleware";

const AuthRoute = Router();
AuthRoute.post("/register", UserHandlers.registerHandler);
AuthRoute.post("/login", UserHandlers.loginHandler);
AuthRoute.get("/me", JWTVerifyMiddleware, UserHandlers.currentUserHandler);

export default AuthRoute;
