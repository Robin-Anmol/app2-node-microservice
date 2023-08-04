import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user.route";
import { signoutRouter } from "./routes/signout.route";
import { signinRouter } from "./routes/signin.route";
import { signupRouter } from "./routes/signup.route";
import { ErrorHandler } from "./middlewares/errors.middleware";
import { NotFoundError } from "./errors/not-found-error";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(signinRouter);
app.use(signupRouter);
app.use(currentUserRouter);
app.use(signoutRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(ErrorHandler);

export { app };
