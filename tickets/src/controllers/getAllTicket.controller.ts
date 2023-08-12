import { NextFunction, Request, Response } from "express";
import { Tickets } from "../models/tickets.model";
import {
  CustomError,
  NotFoundError,
  UnauthorizedError,
} from "@robinanmol/common";

async function getAllTicketController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ticket = await Tickets.find({
      orderId: undefined,
    });
    if (!ticket) {
      throw new NotFoundError();
    }
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

export default getAllTicketController;
