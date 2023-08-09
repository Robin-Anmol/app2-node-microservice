import { NextFunction, Request, Response } from "express";
import { OrderStatus, Orders } from "../models/order.model";

async function getAllOrdersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await Orders.find({
      userId: req.user?.id,
    }).populate("ticket");
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
}

export { getAllOrdersController };
