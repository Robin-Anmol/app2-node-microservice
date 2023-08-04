import express from "express";
import { singinHandler } from "../controllers/signin.controller";
import { body, validationResult } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid "),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("passsword is required"),
  ],
  validateRequest,
  singinHandler
);

export { router as signinRouter };
