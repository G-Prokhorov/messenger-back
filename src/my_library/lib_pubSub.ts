import redis from "redis";
import parent from "./parent";

export default class redisMs extends parent {
    constructor() {
        super();
        this.subscriber.on("message", (channel: string, message: string) => {
            let messageParse = JSON.parse(message);
                try {
                    this.map.get(channel).get(messageParse.id)(messageParse.err, JSON.parse(messageParse.message));
                    this.unsubscribe(channel, messageParse.id);
                } catch (e) {
                    console.error("Error while catch message. " + e);
                    this.map.get(channel).get(messageParse.id)("Server error", null);
                }
            // }
        });
    }
}