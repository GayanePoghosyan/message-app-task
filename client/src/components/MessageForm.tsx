import { useState } from 'react';
import { useMessages } from '../hooks/useMessages';

export function MessageForm() {
  const [message, setMessage] = useState<string>('');
  const { sendMessage } = useMessages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="input-container">
      <form onSubmit={handleSubmit} className="input-form">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim()}
        >
          <svg viewBox="0 0 24 24" className="send-icon">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
} 