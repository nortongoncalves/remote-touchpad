import { Server } from 'socket.io';
import {
  SocketIO as ISocketIO,
  CreateSocketParams,
  CreateSocketResponse,
} from '../SocketIO';

export class SocketIO implements ISocketIO {
  async create({
    srv,
    opts,
  }: CreateSocketParams): Promise<CreateSocketResponse> {
    const io = new Server(srv, opts);
    return { io };
  }
}
