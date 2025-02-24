import { Router } from 'express';
import { createMessage, getAllMessages } from '../controllers/messageController';

export const messageRouter = Router();

messageRouter.post('/', createMessage);
messageRouter.get('/', getAllMessages); 
