import config from "./lib/config.js"
import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import userRoutes from "./routes/user.route.js"
import pushRoutes from "./routes/push.route.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import { privateProtect } from "./middlewares/private.middleware.js"
import { authProtect } from "./middlewares/auth.middleware.js"
import http from "node:http"
import path from "node:path"
import { createSocket } from "./lib/socket.js"
import process from "node:process"
import { configWebPush } from "./lib/push.js"

const app = express()
const server = new http.Server(app)

let dist
if (process.env.ENV !== "prod") {
    dist = path.resolve("../client/dist")
} else {
    if (process.argv[2] === undefined) {
        dist = path.resolve("client")
    } else {
        dist = path.resolve(process.argv[2])
    }
}
const index = path.join(dist, "index.html")

configWebPush()

createSocket(server)

app.use(express.json({ limit: "20mb" }))
app.use(cookieParser())

app.use(express.static(dist))
app.use("/uploads/public", express.static("uploads/public"))
app.use(
    "/uploads/private",
    authProtect,
    privateProtect,
    express.static("uploads/private")
)

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/user", userRoutes)
app.use("/api/push", pushRoutes)
app.use("/api/", (req, res) => res.status(404).json({ message: "not found" }))

app.use((req, res) => {
    res.sendFile(index)
})

server.listen(config.env.port, () => {
    console.log(`http://127.0.0.1:${config.env.port}`)
    connectDB()
})
