import mongoose from "mongoose";

const Subscription = {
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
};

const userSchema = new mongoose.Schema(
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
      type: [Subscription],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
