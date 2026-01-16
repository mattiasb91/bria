import "dotenv/config";
import mongoose from "mongoose";
const DB_PORT = process.env.DB_PORT ?? "27017";
const DB_NAME = process.env.DB_NAME;
const MONGODB_URI =
  process.env.MONGO_URI ?? `mongodb://127.0.0.1:${DB_PORT}/${DB_NAME}`;

if (!DB_NAME) {
  throw new Error("DB_NAME is not defined in environment variables");
}

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to db:", MONGODB_URI);
  } catch (err) {
    console.log("Connection failed")
  }
}

