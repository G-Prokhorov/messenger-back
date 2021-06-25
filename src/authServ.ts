import redis from "redis";

let publisher = redis.createClient();
const subscriber = redis.createClient();

subscriber.on('message',  (channel:string, message:string) => {
    try {
        let messageParse = JSON.parse(message);
        switch (channel) {
            case "login":
                break;
            case "register":
                break;
            case "test":
                publisher.publish("resTest", JSON.stringify({
                    id: messageParse.id,
                    message: {
                        status: 200,
                        message: new Date().getMinutes(),
                    }
                }));
                break;
        }
    } catch (e) {
        console.error("Error while test microservice. ", + e)
    }
});
subscriber.subscribe('test');