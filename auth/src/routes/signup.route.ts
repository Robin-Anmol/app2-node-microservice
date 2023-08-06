import express, { Response, Request } from "express";
import { body } from "express-validator";
import { validateRequest } from "@robinanmol/common";
import { signupHandler } from "../controllers/singup.controller";

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
