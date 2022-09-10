import mongoose from "mongoose";

const collection = "chat";
const chatSchema = mongoose.Schema({
  id: Number,
  messages: [],
});

mongoose.connect(
  "mongodb+srv://joaquingarese:1a2b3c@cluster0.dcv0epl.mongodb.net/?retryWrites=true&w=majority"
);
let db = mongoose.model(collection, chatSchema);

export default class chatManager {
  save = async (data) => {
    if ((await db.countDocuments()) === 0)
      await db.insertMany({ id: 30303, messages: [] });
    await db.updateMany({ id: 30303 }, { $push: { messages: data } });
    return "Ready!";
  };
  getAll = async () => {
    if ((await db.countDocuments()) === 0) return [];
    let data = await db.find({ id: 30303 }, { _id: 0, messages: 1 });
    let finaliData = data[0].messages;
    return finaliData;
  };
  getAllNormalize = async () => {
    let data = await db.find();
    let finaldata = data[0];
    return finaldata;
  };
}
