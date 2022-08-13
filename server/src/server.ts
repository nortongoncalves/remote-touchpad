import express from 'express';
import { createServer } from 'http';
import { Server as ServerIO, Socket } from 'socket.io';

function cleanSockets(sockets: Socket[]) {
  return sockets.filter(socket => socket.connected);
}

function disconnectSocketsSameAddress(sockets: Socket[], address: string) {
  sockets.forEach(socket => {
    if (socket.handshake.address === address) {
      socket.disconnect();
    }
  });
}

function Server() {
  let statusListen: 'on' | 'off' = 'off';
  const app = express();
  const server = createServer(app);
  const io = new ServerIO(server);
  let sockets: Socket[] = [];

  io.on('connection', socket => {
    disconnectSocketsSameAddress(sockets, socket.handshake.address);
    sockets = cleanSockets(sockets);
    sockets.push(socket);
    console.log(`socket: ${socket.id} connected`);

    socket.on('disconnect', () => {
      console.log(`socket: ${socket.id} disconnected`);
      sockets = sockets.filter(({ id }) => socket.id !== id);
      socket.disconnect();
    });
  });

  server.on('close', () => {
    statusListen = 'off';
    console.info('Server stop...');
  });

  server.listen(3000, () => {
    statusListen = 'on';
    console.info('Server running...');
  });

  return { server, statusListen };
}

export { Server };
