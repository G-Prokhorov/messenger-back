export default function post(id: number, channel: string, publisher: any) {
    return (status: number, messagePost: any = "nothing") => {
        publisher.publish(channel, JSON.stringify({
            id: id,
            message: {
                status: status,
                message: JSON.stringify(messagePost),
            }
        }));
    }
}