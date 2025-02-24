import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { connectDB } from './config/db';
import { WebSocketServer } from 'ws';
import { messageRouter } from './routes/messageRoutes';
import { createWebSocketService } from './services/websocketService';
import { cleanup } from './services/messageService';

const app = express();
const server = createServer(app);
const PORT = 3000;

const wss = new WebSocketServer({ server });
let wsService: any;

app.use(cors());
app.use(express.json());
app.use('/messages', messageRouter);

async function start() {
  try {
    const db = await connectDB();
    const collection = db.collection('messages');
    wsService = createWebSocketService(wss, collection);
    wsService.initialize();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (err) {
    process.exit(1);
  }
}

start();

const shutdown = async () => {
  console.log('Server is closing');
  await wsService?.cleanup();
  await cleanup();
  process.exit(0);
}

// setTimeout(() => {
//   console.log('Simulating server shutdown...');
//   shutdown();
// }, 6000); // 6 seconds

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
