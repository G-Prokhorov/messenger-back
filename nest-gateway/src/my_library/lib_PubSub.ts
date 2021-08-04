import * as redis from "redis";

export default class lib_PubSub {
    protected publisher: any;
    protected subscriber: any;
    protected map = new Map();
    protected count: number = 0;
    private timers = new Map();

    constructor(cb: any) {
        this.publisher = redis.createClient(6379, process.env.REDIS_HOST);
        this.subscriber = redis.createClient(6379, process.env.REDIS_HOST);
        this.subscriber.on("message", async (channel: string, message: string) => {
            if (this.map.has(channel)) {
                let messageParse = JSON.parse(message);
                if (this.timers.has(messageParse.id)) {
                    clearTimeout(this.timers.get(messageParse.id));
                    this.timers.delete(messageParse.id)
                }
                await cb.call(this, channel, messageParse);
            }
        });
    }

    public subscribe(channel: string, cb: any, withTimer: boolean = true): number {
        let id = this.getId();
        this.subscriber.subscribe(channel);
        if (!this.map.has(channel)) {
            this.map.set(channel, new Map());
        }
        this.map.get(channel).set(id, cb);

        if (withTimer) {
            this.withTimer(id, channel, cb);
        }

        return id;
    }

    public publish(channel: string, message: object, id: number = -1): void {
        this.publisher.publish(channel, JSON.stringify({
            id: id,
            message: message,
        }));
    }

    private getId(): number {
        return this.count++;
    }

    private withTimer(id: number, channel: string, cb: any): void {
        let timer = setTimeout(() => {
            this.unsubscribe(channel, id);
            cb("Service Unavailable", null);
            this.timers.delete(id);
        }, 10000);
        this.timers.set(id, timer);
    }


    public unsubscribe(channel: string, id: number): boolean {
        this.map.get(channel).delete(id);
        if (this.map.get(channel).size === 0) {
            this.map.delete(channel);
            this.subscriber.unsubscribe(channel);
            return true;
        }
        return false;
    }
}