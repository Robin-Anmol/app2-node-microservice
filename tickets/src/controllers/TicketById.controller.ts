import { NextFunction, Request, Response } from "express";
import { Tickets } from "../models/tickets.model";
import {
  CustomError,
  NotFoundError,
  UnauthorizedError,
} from "@robinanmol/common";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";
import { natsClient } from "../nats-client";

async function getTicketById(req: Request, res: Response, next: NextFunction) {
  const { ticketId } = req.params;
  try {
    const ticket = await Tickets.findOne({
      _id: ticketId,
    });
    if (!ticket) {
      throw new NotFoundError();
    }
    // console.log(ticket);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

async function updateTicketById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { ticketId } = req.params;
  const { title, price } = req.body;
  try {
    const isTicketExit = await Tickets.findOne({ _id: ticketId });

    if (!isTicketExit) {
      throw new NotFoundError();
    }

    if (isTicketExit.userId !== req.user?.id) {
      throw new UnauthorizedError();
    }

    // if found update  the ticket
    const updateTicket = await Tickets.findOneAndUpdate(
      { _id: ticketId, userId: req.user?.id },
      {
        $set: {
          title,
          price,
        },
      },
      {
        returnDocument: "after",
      }
    );

    const publisher = new TicketUpdatedPublisher(natsClient.client);
    // event publish
    await publisher.publish({
      id: updateTicket!.id,
      title: updateTicket!.title,
      price: updateTicket!.price,
      userId: updateTicket!.userId,
    });

    console.log(updateTicket);

    res.status(200).json(updateTicket);
  } catch (error) {
    next(error);
  }
}

export const TicketByIdController = { getTicketById, updateTicketById };
