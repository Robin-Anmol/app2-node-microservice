import express from "express";
import { getCurrentUser } from "../controllers/currentUser.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/api/users/currentuser", isAuthenticated, getCurrentUser);

export { router as currentUserRouter };
