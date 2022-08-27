import express from 'express';
import { createServer } from 'http';
import { SocketIO, Socket } from './providers/Socket/SocketIO';

class Server {
  private sockets: Socket[] = [];

  constructor(private readonly socket: SocketIO) {}

  async execute() {
    let statusListen: 'on' | 'off' = 'off';
    const app = express();
    const server = createServer(app);
    const { io } = await this.socket.create({
      srv: server,
    });

    io.on('connection', socket => {
      this.addSockets(socket);
      console.info(`socket: ${socket.id} connected`);

      socket.on('disconnect', () => {
        console.info(`socket: ${socket.id} disconnected`);
        this.sockets = this.sockets.filter(({ id }) => socket.id !== id);
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

  addSockets(socket: Socket) {
    this.disconnectSocketsSameAddress(this.sockets, socket.handshake.address);
    this.sockets = this.cleanSocketsDisconnected(this.sockets);
    this.sockets.push(socket);
  }

  cleanSocketsDisconnected(sockets: Socket[]) {
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
