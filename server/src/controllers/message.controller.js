import { PRIVATE } from "../lib/const.js";
import { getSocketIDs } from "../lib/socket.js";
import { internalError, saveImage } from "../lib/utils.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../lib/socket.js";
import messageService from "../services/message.service.js";
import { sendPush } from "../lib/push.js";

const M = "message controller";

export async function markMessageReaded(req, res) {
  try {
    const { message } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(
      message._id,
      {
        readedAt: new Date(),
      },
      { new: true }
    );

    const chatID = message.senderID;

    const recieverIDs = getSocketIDs(chatID);
    if (recieverIDs)
      io.to(Array.from(recieverIDs)).emit("x-readed", updatedMessage);

    return res.status(200).json({ ok: true });
  } catch (error) {
    return internalError(res, error, M, "mark message readed");
  }
}

export async function getFilteredChats(req, res) {
  let { filter } = req.query;
  try {
    filter = filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const otherUsers = await User.find({
      _id: { $ne: req.user._id },
      username: { $regex: filter, $options: "i" },
    })
      .sort({ username: "desc" })
      .select("-password");
    const chats = otherUsers.map((user) => {
      return { user };
    });
    return res.json(chats);
  } catch (error) {
    return internalError(res, error, M, "get filtered chats");
  }
}

export async function getChats(req, res) {
  try {
    const chats = await messageService.getChats(req.user._id);
    return res.json(chats);
  } catch (error) {
    return internalError(res, error, M, "get chats");
  }
}

export async function getOneChat(req, res) {
  const { chatID } = req.params;
  try {
    const chat = await messageService.getChat(req.user._id, chatID);
    return res.json(chat);
  } catch (error) {
    return internalError(res, error, M, "get one chat");
  }
}

export async function getMessages(req, res) {
  try {
    const { chatID } = req.params;
    const { limit, offset } = req.query;
    const userID = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderID: userID, recieverID: chatID },
        { senderID: chatID, recieverID: userID },
      ],
    })
      .sort({ createdAt: "desc" })
      .skip(offset)
      .limit(limit);
    return res.json(messages);
  } catch (error) {
    return internalError(res, error, M, "get messages");
  }
}

export async function sendMessage(req, res) {
  try {
    const { text, image } = req.body;
    if (!text && !image)
      return res.status(400).json({ message: "message is empty" });
    let imageName;
    const { chatID } = req.params;
    const userID = req.user._id;
    if (image) imageName = await saveImage(image, PRIVATE, userID, chatID);
    const message = new Message({
      recieverID: chatID,
      senderID: userID,
      image: imageName,
      text,
    });
    await message.save();

    const recieverIDs = getSocketIDs(chatID);
    if (recieverIDs) io.to(Array.from(recieverIDs)).emit("x-message", message);

    const reciever = await User.findById(chatID);
    // const pushPayload = {
    //   title: "Новое сообщение!",
    //   body: `${req.user.username}: ${message.text || "прислал(а) изображение"}`,
    //   data: {
    //     senderID: userID,
    //   },
    // };

    const pushPayload = {
      type: "new-message",
      chatID: userID,
      username: req.user.username,
      message: {
        text: message.text,
        image: message.image,
      },
    };

    await sendPush(reciever, pushPayload);

    res.status(201).json(message);
  } catch (error) {
    return internalError(res, error, M, "send message");
  }
}
