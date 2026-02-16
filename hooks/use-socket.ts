import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const useSocket = (boardId: string) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io();
    }

    function onConnect() {
      setIsConnected(true);
      socket.emit("join-board", boardId);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [boardId]);

  const emitChange = () => {
    socket.emit("board-change", boardId);
  };

  return { socket, isConnected, emitChange };
};