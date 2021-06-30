import redis from "redis";

export default class parent {
    protected publisher: any;
    protected subscriber: any;
    protected map = new Map();
    protected count: number = 0;

    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
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

    public publish(channel: string, message: object, id: number = -1): void {
        this.publisher.publish(channel, JSON.stringify({
            id: id,
            message: message,
        }));
    }

    private getId(): number {
        return this.count++;
    }

    public unsubscribe(channel: string, id: number):boolean {
        this.map.get(channel).delete(id);
        if (this.map.get(channel).size === 0) {
            this.map.delete(channel);
            this.subscriber.unsubscribe(channel);
            return true;
        }
        return false;
    }
}