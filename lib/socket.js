import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://websockettest.venuebook.in:5000", {
      transports: ["websocket"],
    });
  }
  return socket;
};