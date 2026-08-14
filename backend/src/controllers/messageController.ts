import { Request, Response } from 'express';
import Message from '../models/Message';
import { sendContactEmail } from '../services/emailService';

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: 'Name, email, and message are required' });
      return;
    }

    const newMessage = await Message.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
    });

    // Send email via FormSubmit.co to henryperson11@gmail.com
    sendContactEmail({ name, email, phone, subject, message });

    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error submitting message' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching messages' });
  }
};

export const toggleMessageRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    const message = await Message.findById(id);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    message.read = read !== undefined ? read : !message.read;
    const updated = await message.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error updating message' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error deleting message' });
  }
};
