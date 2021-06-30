export default async function UserAlertCB(channel: string, messageParse: any) {
    let all = this.map.get(channel);
    all.forEach((cb: any) => {
        try {
            cb(messageParse.err, messageParse.message)
        } catch (e) {
            cb("Server error", null)
        }
    });
}