import Message, { type IChat, type IMessage } from "../models/message.model.js"
import User, { type IUser } from "../models/user.model.js"

async function getChats(userID: string): Promise<IChat[]> {
    const messages = await Message.find({
        $or: [{ senderID: userID }, { recieverID: userID }],
    })

    const chatsWithStringIDs = messages.map((message) => {
        const id =
            message.senderID.toString() === userID.toString()
                ? message.recieverID
                : message.senderID
        return id.toString()
    })

    const uniqueChats = new Set(chatsWithStringIDs).keys()

    const result: IChat[] = []

    for (const chatID of uniqueChats) {
        if (chatID === userID.toString()) continue

        const lastMessage: IMessage | null = await Message.findOne({
            $or: [
                { senderID: chatID, recieverID: userID },
                { senderID: userID, recieverID: chatID },
            ],
        }).sort({ createdAt: "desc" })
        if (lastMessage === null) throw new Error("no lastMessage")

        const user: IUser = await User.findOne({ _id: chatID }).select(
            "-password"
        )

        const unreaded = await Message.countDocuments({
            senderID: chatID,
            recieverID: userID,
            readedAt: null,
        })

        const chat: IChat = {
            user,
            lastMessage,
            unreaded,
        }
        result.push(chat)
    }
    result.sort(
        (f, s) =>
            Date.parse(String(s.lastMessage!.createdAt)) -
            Date.parse(String(f.lastMessage!.createdAt))
    )
    return result
}

async function getChat(userID: string, chatID: string) {
    const lastMessage = await Message.findOne({
        $or: [
            { senderID: chatID, recieverID: userID },
            { senderID: userID, recieverID: chatID },
        ],
    }).sort({ createdAt: "desc" })

    const user = await User.findOne({ _id: chatID }).select("-password")

    const unreaded = await Message.countDocuments({
        senderID: chatID,
        recieverID: userID,
        readedAt: null,
    })

    const chat: IChat = {
        user: user!,
        lastMessage: lastMessage,
        unreaded,
    }

    return chat
}

export default {
    getChats,
    getChat,
}
