import User from "../models/user.model.js";
import webPush from "web-push";

export async function sendPush(reciever, payload) {
  for (const subscription of reciever.pushSubscriptions) {
    webPush
      .sendNotification(subscription, JSON.stringify(payload), {
        urgency: "high",
      })
      .catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404)
          await User.findByIdAndUpdate(reciever._id, {
            $pull: {
              pushSubscriptions: {
                endpoint: err.endpoint,
              },
            },
          });

        console.log(`Send push: ${err}`);
      });
  }
}
