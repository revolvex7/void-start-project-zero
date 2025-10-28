import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

let eventListenersAttached = false;

export function getSocket() {
  if (socket && eventListenersAttached) return socket;
  
  const baseURL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v_1\/internal$/, '');
  const token = localStorage.getItem('accessToken');
  
  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  
  socket = io(baseURL, {
    path: '/socket.io',
    autoConnect: !!token,
    transports: ['websocket'], // Force WebSocket to debug the issue
    upgrade: true, // Allow upgrade to WebSocket if possible
    rememberUpgrade: false, // Don't remember failed upgrades
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 20000,
    forceNew: true, // Force new connection
    auth: {
      token: token || '',
    },
  });

  // Add error handling only once
  if (!eventListenersAttached) {
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    eventListenersAttached = true;
  }

  return socket;
}

export function reconnectSocketWithNewToken(token: string | null) {
  if (socket) {
    socket.disconnect();
    socket = null;
    eventListenersAttached = false;
  }
  if (token) {
    // Get new socket with updated token
    getSocket();
  }
}


