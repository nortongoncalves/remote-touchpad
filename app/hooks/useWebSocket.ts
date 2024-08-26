import { io } from 'socket.io-client';

export function useWebSocket() {
  const socket = io('http://192.168.1.23:8087');
  socket.on('connect', () => {
    console.log('Conectado ao servidor!');
  });

  socket.on('message', (data) => {
    console.log('Mensagem recebida:', data);
  });

  socket.on('disconnect', () => {
    console.log('Desconectado do servidor');
  });
  socket.emit('message', 'sended message');
  return {socket};
}
