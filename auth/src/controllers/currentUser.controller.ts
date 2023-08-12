import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { UnauthorizedError } from "@robinanmol/common";

async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!.id);

    if (!user) {
      res.clearCookie("session");
      throw new UnauthorizedError();
    }
    res.status(200).json({ currentUser: user ?? null });
  } catch (err) {
    next(err);
  }
}

export { getCurrentUser };
