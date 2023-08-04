import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorized-errror";

export interface UserPayload {
  id: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    throw new UnauthorizedError();
  }

  try {
    const payload = (await jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    )) as UserPayload;
    req.user = payload;
  } catch (err) {
    throw new UnauthorizedError();
  }
  next();
};
