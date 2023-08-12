import express from "express";
import mongoose from "mongoose";
import { getAllOrdersController } from "../controllers/getAllOrders.controller";
import { CreateOrderController } from "../controllers/CreateOrder.controller";
import { getOrderByIdController } from "../controllers/OrderById.controller";
import { isAuthenticated, validateRequest } from "@robinanmol/common";
import { body } from "express-validator";

const router = express.Router();

// orders router for get all orders and create order
router
  .route("/orders")
  .get(isAuthenticated, getAllOrdersController)
  .post(
    isAuthenticated,
    [
      body("ticketId")
        .not()
        .isEmpty()
        // .custom((val: string) => mongoose.Types.ObjectId.isValid(val))
        .withMessage("ticketId is required."),
    ],
    validateRequest,
    CreateOrderController
  );

router
  .route("/orders/:orderId")
  .get(isAuthenticated, getOrderByIdController.getOrderById)
  .patch(isAuthenticated, getOrderByIdController.cancelledOrderById);

export { router as OrderRouter };
