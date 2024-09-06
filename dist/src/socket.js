"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// socket.js
const socket_io_1 = require("socket.io");
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: "*",
        },
    });
    io.on("connection", (socket) => {
        console.log("connected to sockets");
        socket.on("setup", (userId) => {
            socket.join(userId);
            socket.broadcast.emit("online-user", userId);
            console.log(userId);
        });
        socket.on("typing", (room) => {
            socket.to(room).emit("typing", room);
        });
        socket.on("stop typing", (room) => {
            socket.to(room).emit("stop typing", room);
        });
        socket.on("join chat", (room) => {
            socket.join(room);
        });
        socket.on("new message", (newMessageReceived) => {
            var chat = newMessageReceived.chat;
            var room = chat._id;
            var sender = newMessageReceived.sender;
            if (!sender || sender._id) {
                console.log("Sender not defined");
            }
            var senderId = sender._id;
            const users = chat.users;
            socket.to(room).emit("message received", newMessageReceived);
            socket.to(room).emit("message sent", "New Message");
        });
        socket.off("setup", () => {
            // user offline
        });
    });
};
exports.default = setupSocket;
//# sourceMappingURL=socket.js.map