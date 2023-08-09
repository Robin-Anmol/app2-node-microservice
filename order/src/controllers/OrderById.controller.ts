import { NextFunction, Request, Response } from "express";
import { Orders, OrderStatus } from "../models/order.model";
import { NotFoundError, UnauthorizedError } from "@robinanmol/common";
import { OrderCancelledPublisher } from "../events/publisher/order.cancelled.publisher";
import { natsClient } from "../nats-client";

async function getOrderById(req: Request, res: Response, next: NextFunction) {
  const { orderId } = req.params;
  try {
    const order = await Orders.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.user?.id) {
      throw new UnauthorizedError();
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

async function deleteOrderById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { orderId } = req.params;
  try {
    const order = await Orders.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.user?.id) {
      throw new UnauthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    // publish an event saying the order has been deleted or cancelled
    const publisher = new OrderCancelledPublisher(natsClient.client);
    await publisher.publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).json(order);
  } catch (err) {
    next(err);
  }
}

export const getOrderByIdController = { getOrderById, deleteOrderById };
