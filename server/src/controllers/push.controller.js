import User from "../models/user.model.js";

export function getVapidPublicKey(req, res) {
  return res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
}

export async function subscribe(req, res) {
  const subscription = req.body;
  const userID = req.user._id;
  await User.findByIdAndUpdate(userID, {
    $push: { pushSubscriptions: subscription },
  });
  return res.status(201).json();
}

export async function unsubscribe(req, res) {
  const subscription = req.body;
  const userID = req.user._id;
  await User.findByIdAndUpdate(userID, {
    $pull: {
      pushSubscriptions: {
        endpoint: subscription.endpoint,
      },
    },
  });
  return res.status(200).json();
}
