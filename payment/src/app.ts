import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import morgan from "morgan";

import cookieSession from "cookie-session";

import { NotFoundError, ErrorHandler } from "@robinanmol/common";
import { PaymentRouter } from "./routes/payment";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(morgan("dev"));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

// payment service routes

app.use("/api/", PaymentRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(ErrorHandler);

export { app };
