import { Server } from "socket.io"
import http from "node:http"

type TUserID = string

const onliners: Map<TUserID, Set<string>> = new Map()

export function getSocketIDs(userID: TUserID) {
    return onliners.get(userID)
}

export let io: Server

export function createSocket(server: http.Server) {
    io = new Server(server)
    configIO(io)
}

function configIO(io: Server) {
    io.on("connection", (socket) => {
        const userID = socket.handshake.query.userID
        if (!userID || Array.isArray(userID)) return

        let typingTimeouts = new Map<TUserID, NodeJS.Timeout>()

        const onliner = onliners.get(userID)
        if (onliner) {
            onliner.add(socket.id)
        } else {
            onliners.set(userID, new Set([socket.id]))
        }
        io.emit("x-online", [...onliners.keys()])

        socket.on("disconnect", () => {
            const onliner = onliners.get(userID)
            if (onliner) {
                onliner.delete(socket.id)
                if (onliner.size === 0) {
                    onliners.delete(userID)
                    io.emit("x-online", [...onliners.keys()])
                }
            }
        })

        socket.on(
            "f-typing",
            ({ chatID, isTyping }: { chatID: string; isTyping: boolean }) => {
                const targetOnliner = onliners.get(chatID)
                if (!targetOnliner) return
                clearTimeout(typingTimeouts.get(chatID))

                socket
                    .to(Array.from(targetOnliner))
                    .emit("x-typing", { chatID: userID, isTyping })

                if (isTyping) {
                    const timeout = setTimeout(() => {
                        if (!targetOnliner) return
                        socket.to(Array.from(targetOnliner)).emit("x-typing", {
                            chatID: userID,
                            isTyping: false,
                        })
                    }, 3000)
                    typingTimeouts.set(chatID, timeout)
                }
            }
        )
    })
}
