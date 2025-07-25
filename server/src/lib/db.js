import mongoose from "mongoose";
import process from "node:process";

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI);
    console.log(`mongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`mongoDB connection error: ${error}`);
  }
}
