import { NextFunction, Request, Response } from "express";

async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  console.log(req.user);
  res.status(200).json({ currentUser: req.user ?? null });
}

export { getCurrentUser };
