export default async function UserAlertCB(channel: string, messageParse: any) {
    let all = this.map.get(channel);
    console.log(messageParse);
    all.forEach((cb: any) => {
        try {
            cb(messageParse.err, messageParse.message, messageParse.id)
        } catch (e) {
            console.error(e)
            cb("Server error", null)
        }
    });
}