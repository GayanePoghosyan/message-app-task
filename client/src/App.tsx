import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { MessageForm } from './components/MessageForm';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppWrapper from './components/Wrapper';

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppWrapper>
        <Header />
        <main className="main">
          <MessageList />
        </main>
        <MessageForm />
      </AppWrapper>
    </QueryClientProvider>
  )
}

export default App;
