import redis from "redis";
import postFunc from "./auth/post";
import createChat from "./message/createChat";
import sendMessage from "./message/sendMessage";
import sanitizer from "sanitizer";
import getMessage from "./message/getMessage";
import markRead from "./message/markRead";

const publisher = redis.createClient();
const subscriber = redis.createClient();

subscriber.on('message', async (channel: string, message: string) => {
    try {
        let messageParse = JSON.parse(message);
        const id = messageParse.id;
        const post = postFunc(id, publisher);
        switch (channel) {
            case "createChat":
                try {
                    let res = await createChat(messageParse.message.users);
                    post("resCreateChat", res);
                } catch (e) {
                    post("resCreateChat", null, e.message)
                }
                break;
            case "sendMessage":
                try {
                    let users = await sendMessage(messageParse.message);
                    users.forEach((value: any) => {
                        publisher.publish(value.username, JSON.stringify({
                            err: "success",
                            message: {
                                message: message,
                                chatId: messageParse.message.chatId,
                            }
                        }));
                    });
                } catch (e) {
                    try {
                        let user = sanitizer.escape(messageParse.message.sender);
                        post(user, null, e.message);
                    } catch (e) {
                        console.error(e);
                    }
                }
                break;
            case "getMessage":
                try {
                    let messages = await getMessage(messageParse.message);
                    post("resGetMessage", messages);
                } catch (e) {
                    post("resGetMessage", null, e.message)
                }
                break;
            case "markRead":
                try {
                    await markRead(messageParse.message);
                    post("resMarkRead", "Okay");
                } catch (e) {
                    post("resMarkRead", null, e.message)
                }
        }
    } catch (e) {
        console.error("Error in message microservice. ", +e)
    }
});

subscriber.subscribe('createChat', 'sendMessage', 'getMessage', 'markRead');
