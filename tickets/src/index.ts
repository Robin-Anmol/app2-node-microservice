import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is  required");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is  required");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log("tickets service listening on port 3000");
  });
};

start();
