import express from 'express';
import { createServer } from 'http';
import { SocketIO, Socket } from './providers/Socket/SocketIO';

class Server {
  constructor(private readonly socket: SocketIO) {}

  async execute() {
    let statusListen: 'on' | 'off' = 'off';
    const app = express();
    const server = createServer(app);
    const { io } = await this.socket.create({
      srv: server,
    });
    let sockets: Socket[] = [];

    io.on('connection', socket => {
      this.disconnectSocketsSameAddress(sockets, socket.handshake.address);
      sockets = this.cleanSockets(sockets);
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

    return { sv: server, statusListen };
  }

  cleanSockets(sockets: Socket[]) {
    return sockets.filter(socket => socket.connected);
  }

  disconnectSocketsSameAddress(sockets: Socket[], address: string) {
    sockets.forEach(socket => {
      if (socket.handshake.address === address) {
        socket.disconnect();
      }
    });
  }
}

export { Server };
