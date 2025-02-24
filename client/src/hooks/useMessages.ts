import { useMutation, useQuery } from '@tanstack/react-query';
import { config } from '../config/config';

export const useMessages = () => {
  const { apiUrl } = config;

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
