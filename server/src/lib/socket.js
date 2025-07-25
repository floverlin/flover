import { Server } from "socket.io";

/** @const { userID: Set<socketID> } */
const onliners = {};

/** @return { Set<socketID> } */
export function getSocketIDs(userID) {
  return onliners[userID];
}

export let io;

export function createSocket(server) {
  io = new Server(server);
  configIO(io);
}

function configIO(io) {
  io.on("connection", (socket) => {
    const userID = socket.handshake.query.userID;
    if (!userID) return;

    let typingTimeouts = {};

    if (onliners[userID]) {
      onliners[userID].add(socket.id);
    } else {
      onliners[userID] = new Set([socket.id]);
    }
    io.emit("x-online", Object.keys(onliners));

    socket.on("disconnect", () => {
      onliners[userID].delete(socket.id);
      if (onliners[userID].size === 0) {
        delete onliners[userID];
        io.emit("x-online", Object.keys(onliners));
      }
    });

    socket.on("f-typing", ({ chatID, isTyping }) => {
      if (!onliners[chatID]) return;
      clearTimeout(typingTimeouts[chatID]);
      socket
        .to(Array.from(onliners[chatID]))
        .emit("x-typing", { chatID: userID, isTyping });

      if (isTyping) {
        typingTimeouts[chatID] = setTimeout(() => {
          if (!onliners[chatID]) return;
          socket
            .to(Array.from(onliners[chatID]))
            .emit("x-typing", { chatID: userID, isTyping: false });
        }, 3000);
      }
    });
  });
}
