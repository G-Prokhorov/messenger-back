export default async function microServCB(channel: string, messageParse: any) {
    try {
        this.map.get(channel).get(messageParse.id)(messageParse.err, JSON.parse(messageParse.message));
        this.unsubscribe(channel, messageParse.id);
    } catch (e) {
        console.error("Error while catch message. " + e);
        this.map.get(channel).get(messageParse.id)("Server error", null);
    }
}