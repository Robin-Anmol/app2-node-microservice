import { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/ticket.model";
import { Orders } from "../models/order.model";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from "@robinanmol/common";
import { OrderCreatedPublisher } from "../events/publisher/order.created.publisher";
import { natsClient } from "../nats-client";

const EXPIRATION_WINDOW_TIME = 5 * 60;
async function CreateOrderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { ticketId } = req.body;
  try {
    //   find the ticket which is trying to created in the db
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }
    //make sure the ticket is not already reserved

    const isOrderTicketReserved = await ticket.isReserved();

    if (isOrderTicketReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }
    // calculate an expiration date for this order

    const expirationDate = new Date();

    expirationDate.setSeconds(
      expirationDate.getSeconds() + EXPIRATION_WINDOW_TIME
    );

    //   build the order and save to the database

    const order = await Orders.create({
      userId: req.user?.id,
      status: OrderStatus.Created,
      expiresAt: expirationDate,
      ticket: ticket,
    });

    // publish an event saying the order has been created
    const publisher = new OrderCreatedPublisher(natsClient.client);
    await publisher.publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export { CreateOrderController };
