import redis from "redis";

export default class redisMs {
    private publisher: any;
    private subscriber: any;
    private map = new Map();
    private count: number = 0;

    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        this.subscriber.on("message", (channel: any, message: any) => {
            console.log(`${channel}: ${message}`);
        });
    }

    public subscribe(channel: string, cb: any):number {
        let id = this.getId();
        this.subscriber.subscribe(channel);
        if (!this.map.has(channel)) {
            this.map.set(channel, new Map());
        }
        this.map.get(channel).set(id, cb);
        return id;
    }

    public publish(channel: string, message: string, id: number):void {
        this.publisher.publish(channel, JSON.stringify({
            id: id,
            message: message,
        }));
    }

    private getId():number {
        return this.count++;
    }

}