import express, { Response, Request } from "express";
import { body, validationResult } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connecttion-error";
import { signupHandler } from "../controllers/singup.controller";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid "),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be  between 4 and 20 characters"),
  ],
  validateRequest,
  signupHandler
);

export { router as signupRouter };
