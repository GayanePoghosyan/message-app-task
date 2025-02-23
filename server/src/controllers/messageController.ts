import { Request, Response } from 'express';
import { getMessages, createNewMessage } from '../services/messageService';


export async function createMessage(req: Request, res: Response) {
  try {
    const {content} = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Message content is required' });
    }
    await createNewMessage(content);
    return res.status(201).json({ success: true, message: 'Message created successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to create message' });
  }
}

export async function getAllMessages(req: Request, res: Response) {
  try {
    const messages = await getMessages();
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
}
