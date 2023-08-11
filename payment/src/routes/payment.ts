import { isAuthenticated, validateRequest } from "@robinanmol/common";
import express from "express";
import { body } from "express-validator";
import { createPaymentController } from "../controllers/payment.controller";

const router = express.Router();

router.route("/payments").post(
  isAuthenticated,
  [
    body("payment_method_id").custom((value, { req }) => {
      if (!value && !req.body.payment_intent_id) {
        throw new Error(" payment_method_id  is required");
      }
      return true;
    }),
    body("payment_intent_id").custom((value, { req }) => {
      if (!value && !req.body.payment_method_id) {
        throw new Error("payment_intent_id is required");
      }
      return true;
    }),
    body("orderId").not().isEmpty().withMessage("OrderId should not be empty"),
  ],
  validateRequest,
  createPaymentController
);

export { router as PaymentRouter };
