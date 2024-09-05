// socket.js
import { Server } from 'socket.io';
import { Server as HTTPServer } from "http";

const setupSocket = (server: HTTPServer) => {
    const io = new Server(server, {
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

export default setupSocket;
