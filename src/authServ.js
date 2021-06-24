const redis = require("redis");
let publisher = redis.createClient();

const subscriber = redis.createClient();

subscriber.on('message',  (channel, message) => {
    try {
        switch (channel) {
            case "login":
                break;
            case "register":
                break;
            case "test":
                console.log("here")
                let messageParse = JSON.parse(message);
                publisher.publish("resTest", JSON.stringify({
                    id: messageParse.id,
                    message: {
                        status: 200,
                        message: new Date().getMinutes(),
                    }
                }))
                break;
        }
    } catch (e) {
        console.error("Error while test microservice. ", + e)
    }
});
subscriber.subscribe('test');