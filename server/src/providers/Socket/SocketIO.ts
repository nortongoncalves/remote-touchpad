import http from 'http';
import type { Server as HTTPSServer } from 'https';

export type ServerOptions = {
  path: string;
  connectTimeout: number;
};

export type Server = number | http.Server | HTTPSServer | undefined;
export type Options = Partial<ServerOptions> | undefined;

export type HandShake = {
  address: string;
};

export type Socket = {
  id: string;
  handshake: HandShake;
  connected: boolean;
  on: (name: string, fn: () => void) => void;
  disconnect: () => void;
};

export type InputOutput = {
  on: (name: string, fn: (socket: Socket) => void) => void;
};

export type CreateSocketParams = {
  srv?: Server;
  opts?: Options;
};

export type CreateSocketResponse = {
  io: InputOutput;
};

export interface SocketIO {
  create: (params: CreateSocketParams) => Promise<CreateSocketResponse>;
}
