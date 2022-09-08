import mongoose from "mongoose";

const collection = "Chats";
const schema = new mongoose.Schema(
  {
    author: {
      email: String,
      first_name: String,
      last_name: String,
      age: Number,
      alias: String,
      avatar: String,
    },
    message: String,
    date: String,
    time: String,
  },
  { versionKey: false }
);

const chatsService = mongoose.model(collection, schema);

export default chatsService;
