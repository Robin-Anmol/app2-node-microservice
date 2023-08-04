import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user.model";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../utils/password";
import jwt from "jsonwebtoken";
async function singinHandler(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }

  const ispassMatch = await Password.compare(existingUser.password, password);

  if (!ispassMatch) {
    throw new BadRequestError("Invalid credentials");
  }
  // generate token if email and passsword match
  const token = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    process.env.JWT_KEY!
  );
  // store the token
  req.session = { jwt: token };
  res.status(200).json(existingUser);
}

export { singinHandler };
