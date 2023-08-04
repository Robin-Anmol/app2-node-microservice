import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user.model";
import { BadRequestError } from "../errors/bad-request-error";
import jwt, { SignOptions } from "jsonwebtoken";

async function signupHandler(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  const isUserExit = await User.findOne({ email });

  if (isUserExit) {
    throw new BadRequestError("Email is already in use");
  }

  const user = await User.build({
    email,
    password,
  });

  await user.save();

  // const signOptions: SignOptions = {
  //   audience: "robinanmol",
  //   algorithm: "HS256",
  //   issuer: "microservice",
  //   expiresIn: 1000 * 60 * 15,
  // };

  // generate json webtoken
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_KEY!
  );
  // store the token
  req.session = { jwt: token };

  res.status(201).json(user);
}

export { signupHandler };
