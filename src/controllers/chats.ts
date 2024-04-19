import { Response, Request, NextFunction } from "express";
import Chat from "../models/Chat";
import asyncWrapper from "../async-wrapper/async-wrapper";

export const createChat = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user1, user2 } = req.body;
    const chat = new Chat({ user1, user2 });
    await chat.save();
    res.status(201).json({ chat });
  }
);

export const sendChat = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const { message } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      { _id: chatId },
      {
        $push: {
          messages: {
            sender: req.userId,
            text: message,
          },
        },
      }
    );
  }
);

export const getChats = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const chats = await Chat.findOne({ _id: req.params.chatId });
    if (!chats) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }
    res.status(200).json({ chats });
  }
);
