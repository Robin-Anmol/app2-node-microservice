import express from "express";
import { signoutHandler } from "../controllers/signout.controller";

const router = express.Router();

router.post("/api/users/signout", signoutHandler);

export { router as signoutRouter };
