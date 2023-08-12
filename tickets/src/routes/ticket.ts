import express, { Request, Response } from "express";
import CreateTicketHandler from "../controllers/CreateTicket.controller";
import { isAuthenticated, validateRequest } from "@robinanmol/common";
import { body } from "express-validator";
import { TicketByIdController } from "../controllers/TicketById.controller";
import getAllTicketController from "../controllers/getAllTicket.controller";

const router = express.Router();

router
  .route("/tickets")
  .post(
    isAuthenticated,
    [
      body("title")
        .isString()
        .notEmpty()
        .trim()
        .withMessage("title is required. it should be a string "),
      body("price")
        .isFloat({ gt: 0 })
        .notEmpty()
        .trim()
        .withMessage("price is required. it should be a number "),
    ],
    validateRequest,
    CreateTicketHandler
  )
  .get(getAllTicketController);

router
  .route("/tickets/:ticketId")
  .get(TicketByIdController.getTicketById)
  .patch(
    isAuthenticated,
    [
      body("title")
        .optional()
        .not()
        .isFloat()
        .isString()
        .notEmpty()
        .withMessage("title is invalid. it should be a string "),
      body("price")
        .optional()
        .not()
        .isString()
        .isFloat({ gt: 0 })
        .notEmpty()
        .withMessage(
          "price is invalid. it should be a number. it should be greater than 0. "
        ),
    ],
    validateRequest,
    TicketByIdController.updateTicketById
  );

export { router as TicketRouter };
