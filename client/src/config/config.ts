export const config = {
  wsUrl: (import.meta as any).env.VITE_WS_URL || 'ws://localhost:3000',
  apiUrl: (import.meta as any).env.VITE_API_URL || 'http://localhost:3000'
};
 