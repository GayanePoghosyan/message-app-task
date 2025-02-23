import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { config } from '../config/config';
import { Message } from '../types';

export function useMessages() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const { apiUrl, wsUrl } = config;
  let reconnectTimer: NodeJS.Timeout;

  const { data: messages } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/messages`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
    refetchOnMount: false,
  });


  const connectWebSocket = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket Connected');
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'newMessage') {
          queryClient.setQueryData<Message[]>(['messages'], (old = []) => {
            if (old.some(msg => msg._id === data.message._id)) {
              return old;
            }
            return [...old, data.message];
          });
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        wsRef.current = null; 
        reconnectTimer = setTimeout(connectWebSocket, 5000);
      };
    }
  }, [queryClient]);

  useEffect(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null; 
      }
      clearTimeout(reconnectTimer);
      connectWebSocket();
  }, []);

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`${apiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      return response.json();
    },
  });

  return { messages, sendMessage };
}