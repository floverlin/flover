import mongoose, { Document } from "mongoose"
import type { IUser } from "./user.model.js"

export interface IMessage extends Document {
    _id: mongoose.Types.ObjectId
    recieverID: mongoose.Types.ObjectId
    senderID: mongoose.Types.ObjectId
    text?: string
    image?: string
    readedAt: Date | null
    createdAt: Date
    updatedAt: Date
}

export interface IChat {
    user: IUser
    lastMessage: IMessage | null
    unreaded: number
}

const messageSchema = new mongoose.Schema<IMessage>(
    {
        senderID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recieverID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
        readedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
)

const Message = mongoose.model<IMessage>("Message", messageSchema)

export default Message
