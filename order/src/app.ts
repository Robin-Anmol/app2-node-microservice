import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import morgan from "morgan";

import cookieSession from "cookie-session";
import { OrderRouter } from "./routes/order";
import { NotFoundError, ErrorHandler } from "@robinanmol/common";

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

// order service routes

app.use("/api/", OrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(ErrorHandler);

export { app };
