const redis = require("redis");
let publisher = redis.createClient();

const subscriber = redis.createClient();

subscriber.on('message',  (channel, message) => {
    switch (channel) {
        case "login":
            break;
        case "register":
            break;
        case "test":
            console.log("here")
            publisher.publish("resTest", JSON.stringify({
                status: 200,
                text: {
                    message: new Date().getMinutes(),
                }
            }))
            break;
    }
});
subscriber.subscribe('test');