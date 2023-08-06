import { NextFunction, Request, Response } from "express";
import { Tickets } from "../models/tickets.model";

async function CreateTicketController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, price } = req.body;

  try {
    const ticket = await Tickets.create({ title, price, userId: req.user?.id });
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
}

export default CreateTicketController;
