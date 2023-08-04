import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not required");
  }
  try {
    await mongoose.connect("mongodb://auth-monogodb-srv:27017/auth");
    console.log("connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
};

start();
