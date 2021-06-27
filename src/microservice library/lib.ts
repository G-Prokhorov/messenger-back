import redis from "redis";

export default class redisMs {
    private publisher: any;
    private subscriber: any;
    private map = new Map();
    private count: number = 0;

    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        this.subscriber.on("message", (channel: string, message: string) => {
            let messageParse = JSON.parse(message);
            try {
                this.map.get(channel).get(messageParse.id)(messageParse.err, JSON.parse(messageParse.message));
                this.unsubscribe(channel, messageParse.id);
            } catch (e) {
                console.error("Error while catch message. " + e);
                this.map.get(channel).get(messageParse.id)("Server error", null);
            }
        });
    }

    public subscribe(channel: string, cb: any): number {
        let id = this.getId();
        this.subscriber.subscribe(channel);
        if (!this.map.has(channel)) {
            this.map.set(channel, new Map());
        }
        this.map.get(channel).set(id, cb);
        return id;
    }

    public publish(channel: string, message: object, id: number): void {
        this.publisher.publish(channel, JSON.stringify({
            id: id,
            message: message,
        }));
    }

    private getId(): number {
        return this.count++;
    }

    public unsubscribe(channel: string, id: number) {
        this.map.get(channel).delete(id);
        if (this.map.get(channel).size === 0) {
            this.map.delete(channel);
        }
    }
}