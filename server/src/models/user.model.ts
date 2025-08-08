import mongoose, { Document } from "mongoose"

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    email: string
    username: string
    avatar?: string
    password: string
    pushSubscriptions: ISubscription[]
    createdAt: Date
    updatedAt: Date
}

interface ISubscription {
    endpoint: string
    keys: {
        p256dh: string
        auth: string
    }
}

const SubscriptionSchema = new mongoose.Schema<ISubscription>({
    endpoint: String,
    keys: {
        p256dh: String,
        auth: String,
    },
})

const userSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "",
        },
        password: {
            type: String,
            required: true,
        },
        pushSubscriptions: {
            type: [SubscriptionSchema],
            default: [],
        },
    },
    { timestamps: true }
)

const User = mongoose.model<IUser>("User", userSchema)

export default User
