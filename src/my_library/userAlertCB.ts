export default async function UserAlertCB(channel: string, messageParse: any) {
    let all = this.map.get(channel);
    all.forEach((cb: any) => {
        try {
            console.log(messageParse)
            cb(messageParse.err, messageParse.message.message)
        } catch (e) {
            console.error(e)
            cb("Server error", null)
        }
    });
}