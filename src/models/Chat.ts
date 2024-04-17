import mongoose from "mongoose";

export type ChatType = {
  _id: string;
  user1: mongoose.Types.ObjectId;
  user2: mongoose.Types.ObjectId;
  messages: {
    sender: mongoose.Types.ObjectId;
    text: string;
  };
};

const chatSchema = new mongoose.Schema<ChatType>({
  user1: mongoose.Schema.Types.ObjectId,
  user2: mongoose.Schema.Types.ObjectId,
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: String,
    },
  ],
});

const Chat = mongoose.model<ChatType>("Chat", chatSchema);
export default Chat;
