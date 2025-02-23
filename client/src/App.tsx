import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { MessageForm } from './components/MessageForm';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Header />
        <main className="main">
          <MessageList />
        </main>
        <MessageForm />
      </div>
    </QueryClientProvider>
  );
}

export default App;
