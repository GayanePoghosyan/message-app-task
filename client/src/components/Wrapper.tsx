import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  useWebSocket();
  
  return  (
  <div className="app">
    {children}
  </div>
  );
};

export default AppWrapper;