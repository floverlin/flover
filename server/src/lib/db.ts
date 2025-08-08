import mongoose from "mongoose"
import process from "node:process"

export async function connectDB() {
    try {
        if (!process.env.DATABASE_URI) throw new Error("No DATABSE_URI in env")
        const conn = await mongoose.connect(process.env.DATABASE_URI)
        console.log(`mongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`mongoDB connection error: ${error}`)
    }
}
