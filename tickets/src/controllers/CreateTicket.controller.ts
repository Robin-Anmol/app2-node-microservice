import { NextFunction, Request, Response } from "express";
import { Tickets } from "../models/tickets.model";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsClient } from "../nats-client";

async function CreateTicketController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, price } = req.body;

  try {
    const ticket = await Tickets.create({ title, price, userId: req.user?.id });

    const publisher = new TicketCreatedPublisher(natsClient.client);
    // event publish
    await publisher.publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
}

export default CreateTicketController;
