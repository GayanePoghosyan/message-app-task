import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { config } from '../config/config';
import { Message } from '../types';


export const useWebSocket = () => {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<number | null>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'newMessage') {
        queryClient.setQueryData<Message[]>(['messages'], (old = []) => {
          if (old.some(msg => msg._id === data.message._id)) {
            return old;
          }
          return [...old, data.message];
        });
      }
    } catch (error) {
      console.error('WebSocket message parsing error:', error);
    }
  }, [queryClient]);

  const handleError = useCallback((error: Event) => {
    console.error('WebSocket error:', error);
  }, []);

  const handleOpen = useCallback(() => {
    console.log('WebSocket Connected');
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    wsRef.current = new WebSocket(config.wsUrl);

    wsRef.current.onopen = handleOpen;
    wsRef.current.onmessage = handleMessage;
    wsRef.current.onerror = handleError;

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      reconnect();
    };
  }, [handleMessage, handleError, handleOpen]);

  
  const reconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    reconnectTimeout.current = window.setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      connectWebSocket();
    }, 5000);
  }, [connectWebSocket]);


  useEffect(() => {
    connectWebSocket(); 

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connectWebSocket]);
}; 