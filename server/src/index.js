import "./lib/config.js";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import { privateProtect } from "./middlewares/private.middleware.js";
import { authProtect } from "./middlewares/auth.middleware.js";
import http from "node:http";
import path from "node:path";
import { createSocket } from "./lib/socket.js";
import process from "node:process";

const app = express();
const server = new http.Server(app);
const port = process.env.PORT;
let dist;
if (process.env.ENV !== "prod") {
  dist = path.resolve("../client/dist");
} else {
  if (process.argv.length <= 2) {
    dist = path.resolve("dist");
  } else {
    dist = path.resolve(process.argv[2]);
  }
}
const index = path.join(dist, "index.html");

createSocket(server);

app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

app.use(express.static(dist));
app.use("/uploads/public", express.static("uploads/public"));
app.use(
  "/uploads/private",
  authProtect,
  privateProtect,
  express.static("uploads/private")
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);

app.use((req, res) => {
  res.sendFile(index);
});

server.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
  connectDB();
});
