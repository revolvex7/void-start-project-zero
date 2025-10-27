import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;
  const baseURL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v_1\/internal$/, '');
  const token = localStorage.getItem('accessToken');
  socket = io(baseURL, {
    path: '/socket.io',
    autoConnect: !!token,
    transports: ['websocket'],
    auth: {
      token: token || '',
    },
  });
  return socket;
}

export function reconnectSocketWithNewToken(token: string | null) {
  if (!socket) return;
  socket.auth = { token: token || '' } as any;
  if (token) socket.connect();
  else socket.disconnect();
}


