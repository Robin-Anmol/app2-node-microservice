import express from "express";
import { singinHandler } from "../controllers/signin.controller";
import { body } from "express-validator";
import { validateRequest } from "@robinanmol/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().notEmpty().withMessage("Email must be valid "),
    body("password").notEmpty().trim().withMessage("password is required"),
  ],
  validateRequest,
  singinHandler
);

export { router as signinRouter };
