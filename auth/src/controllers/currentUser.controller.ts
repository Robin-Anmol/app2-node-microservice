import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-error";
import { UserPayload } from "../middlewares/auth.middleware";

async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  res.status(200).json({ currentUser: req.user ?? null });
}

export { getCurrentUser };
