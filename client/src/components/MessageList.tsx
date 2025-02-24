import { useEffect, useRef } from 'react';
import { useMessages } from '../hooks/useMessages';

export function MessageList() {
  const { messages } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages) return <div className="loading">Loading...</div>;

  return (
    <div className="message-container">
      <div className="message-list">
        { messages.length > 0 ?
           messages.map((message:any) => (
          <div key={message._id} className="message-row">
            <div>{message.content}</div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )):<p className='no-messages'>No messages yet</p>}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}  
