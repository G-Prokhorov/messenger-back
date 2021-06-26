export default function post(id: number, publisher: any) {
    return (channel: string, message: any = null, err: string = null) => {
        publisher.publish(channel, JSON.stringify({
            id: id,
            err: err,
            message: JSON.stringify(message),
        }));
    }
}