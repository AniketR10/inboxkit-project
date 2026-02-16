"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const next_1 = __importDefault(require("next"));
const socket_io_1 = require("socket.io");
const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = "0.0.0.0";
const app = (0, next_1.default)({ dev });
const handler = app.getRequestHandler();
app.prepare().then(() => {
    const httpServer = (0, node_http_1.createServer)(handler);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        socket.on("join-board", (boardId) => {
            socket.join(boardId);
            console.log(`Socket ${socket.id} joined board ${boardId}`);
        });
        socket.on("board-change", (boardId) => {
            socket.to(boardId).emit("refresh-board");
        });
    });
    httpServer
        .once("error", (err) => {
        console.error(err);
        process.exit(1);
    })
        .listen(port, hostname, () => {
        console.log(`> Server ready on port ${port}`);
    });
});
