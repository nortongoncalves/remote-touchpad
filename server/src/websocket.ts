import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

export function websocket() {
  const app = express();
  const httpServer = http.createServer(app);
  const wss = new Server(httpServer);
  httpServer.listen(8087, '127.0.0.1');

  wss.on("connection", (socket) => {
    console.log(socket.id);
  });

  return {httpServer, wss};
}
