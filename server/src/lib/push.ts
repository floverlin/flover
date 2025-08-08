import User, { type IUser } from "../models/user.model.js"
import webPush from "web-push"
import config from "./config.js"

export async function sendPush(reciever: IUser, payload: unknown) {
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
                    })

                console.log(`Send push: ${err}`)
            })
    }
}

export function configWebPush() {
    webPush.setVapidDetails(
        "mailto:xxw1ldl1nxx@gmail.com",
        config.env.vapidPublicKey,
        config.env.vapidPrivateKey
    )
}
