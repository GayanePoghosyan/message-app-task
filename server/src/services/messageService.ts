import { Collection } from 'mongodb';
import { Message } from '../models/message';
import { config, client } from '../config/index';

const BATCH_SIZE = config.messageService.size;
const BATCH_TIMEOUT = config.messageService.timeout;

let messageBuffer: Message[] = [];
let batchTimer: NodeJS.Timeout | null = null;
let messageCollection: Collection = client.db().collection('messages');

const clearBatchTimer = () => {
  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }
};

const addMessageToBuffer = (message: Message) => {
  messageBuffer.push(message);

  if (messageBuffer.length === 1 && !batchTimer) {
    batchTimer = setTimeout(saveMessagesToDatabase, BATCH_TIMEOUT);
  }
};

const saveMessagesToDatabase = async () => {
  if (messageBuffer.length === 0) return;
  const messagesToSave = [...messageBuffer];
  messageBuffer = [];
  clearBatchTimer();

  try {
    await messageCollection.insertMany(messagesToSave.map(msg => ({
      ...msg,
      _id: undefined
    })));

    console.log(`Saved ${messagesToSave.length} messages to database`);
  } catch (error) {
    messageBuffer = [...messagesToSave, ...messageBuffer];
  }
};

export const createNewMessage = async (content: string): Promise<Message> => {
  try {
    const message: Message = {
      content,
      timestamp: new Date()
    }
    addMessageToBuffer(message);

    if (messageBuffer.length == BATCH_SIZE) {
      await saveMessagesToDatabase();
    }

    return message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Failed to create message');
  };
}

export const getMessages = async (): Promise<Message[]> => {
  try {
    const messages = await messageCollection.find().toArray();

    return messages.map(doc => ({
      _id: doc._id.toString(),
      content: doc.content,
      timestamp: doc.timestamp
    }));

  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages');
  };
}

export const cleanup = async () => {
  try {
    clearBatchTimer();

    if (messageBuffer.length > 0) {
      await saveMessagesToDatabase();
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw new Error('Failed to cleanup message service');
  }
}
