import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import { getLocalIp } from './utils/getLocalIp';

export async function websocket() {
  const app = express();
  const httpServer =  http.createServer(app);
  const wss = new Server(httpServer);
  const [localIp] = await getLocalIp();
  httpServer.listen(8087, localIp);

  return {httpServer, wss, localIp};
}
