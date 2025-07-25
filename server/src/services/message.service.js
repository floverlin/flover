import Message from "../models/message.model.js";
import User from "../models/user.model.js";

async function getChats(userID) {
  const messages = await Message.find({
    $or: [{ senderID: userID }, { recieverID: userID }],
  });

  const chatsWithStringIDs = messages.map((message) => {
    const id =
      message.senderID.toString() === userID.toString()
        ? message.recieverID
        : message.senderID;
    return id.toString();
  });

  const uniqueChats = new Set(chatsWithStringIDs).keys();

  const result = [];

  for (const chatID of uniqueChats) {
    if (chatID === userID.toString()) continue;

    const lastMessage = await Message.findOne({
      $or: [
        { senderID: chatID, recieverID: userID },
        { senderID: userID, recieverID: chatID },
      ],
    }).sort({ createdAt: "desc" });

    const user = await User.findOne({ _id: chatID }).select("-password");

    const unreaded = await Message.countDocuments({
      senderID: chatID,
      recieverID: userID,
      readedAt: null,
    });

    const chat = {
      user,
      lastMessage,
      unreaded,
    };
    result.push(chat);
  }
  result.sort(
    (f, s) =>
      Date.parse(s.lastMessage.createdAt) - Date.parse(f.lastMessage.createdAt)
  );
  return result;
}

async function getChat(userID, chatID) {
  const lastMessage = await Message.findOne({
    $or: [
      { senderID: chatID, recieverID: userID },
      { senderID: userID, recieverID: chatID },
    ],
  }).sort({ createdAt: "desc" });

  const user = await User.findOne({ _id: chatID }).select("-password");

  const unreaded = await Message.countDocuments({
    senderID: chatID,
    recieverID: userID,
    readedAt: null,
  });

  const chat = {
    user,
    lastMessage,
    unreaded,
  };

  return chat;
}

export default {
  getChats,
  getChat,
};
