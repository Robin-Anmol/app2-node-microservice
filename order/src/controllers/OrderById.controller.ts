import { NextFunction, Request, Response } from "express";
import { Orders, OrderStatus } from "../models/order.model";
import { NotFoundError, UnauthorizedError } from "@robinanmol/common";
import { natsClient } from "../nats-client";
import { OrderCancelledPublisher } from "../events/publisher/order.cancelled.publisher";

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

async function cancelledOrderById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { orderId } = req.params;
  try {
    console.log(orderId);
    const order = await Orders.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.user?.id) {
      throw new UnauthorizedError();
    }

    const updateOrder = await Orders.findOneAndUpdate(
      { _id: orderId, userId: req.user?.id },
      {
        $set: {
          status: OrderStatus.Cancelled,
        },
        $inc: {
          version: 1,
        },
      },
      {
        new: true,
        returnDocument: "after",
      }
    ).populate("ticket");

    // publish an event saying the order has been deleted or cancelled
    const publisher = new OrderCancelledPublisher(natsClient.client);
    await publisher.publish({
      id: updateOrder!.id,
      version: updateOrder!.version,
      ticket: {
        id: updateOrder!.ticket.id,
      },
    });

    res.status(204).json();
  } catch (err) {
    next(err);
  }
}

export const getOrderByIdController = { getOrderById, cancelledOrderById };
