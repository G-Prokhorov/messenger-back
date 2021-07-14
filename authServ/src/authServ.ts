import redis from "redis";
import register from "./auth/register";
import login from "./auth/login";
import postFunc from "./post";
import sendCodeEmail from "./auth/sendCodeEmail";
import updateName from "./auth/updateName";
import changePassword from "./auth/changePassword";
import restorePassword from "./auth/restorePassword";

let publisher = redis.createClient(6379, 'redis');
const subscriber = redis.createClient(6379, 'redis');

subscriber.on('message', async (channel: string, message: string) => {
    try {
        let messageParse = JSON.parse(message);
        const id = messageParse.id;
        const post = postFunc(id, publisher);
        switch (channel) {
            case "login":
                try {
                    let result = await login(messageParse.message);
                    post("resLogin", result);
                } catch (e) {
                    post("resLogin", null, e.message);
                }
                break;
            case "register":
                try {
                    let result =  await register(messageParse.message);
                    post("resRegister", result);
                } catch (e) {
                    post("resRegister", null, e.message);
                }
                break;
            case "sendCodeEmail":
                try {
                    await sendCodeEmail(messageParse.message);
                    post("resSendCodeEmail");
                } catch (e) {
                    post("resSendCodeEmail", null, e.message);
                }
                break;
            case "updateName":
                try {
                    await updateName(messageParse.message);
                    post("resUpdateName");
                } catch (e) {
                    post("resUpdateName", null, e.message);
                }
                break;
            case "changePassword":
                try {
                    await changePassword(messageParse.message);
                    post("resChangePassword");
                } catch (e) {
                    post("resChangePassword", null, e.message);
                }
                break;
            case "restorePassword":
                try {
                    await restorePassword(messageParse.message);
                    post("resRestorePassword");
                } catch (e) {
                    post("resRestorePassword", null, e.message);
                }
                break;
        }
    } catch (e) {
        console.error("Error while test microservice. ", + e)
    }
});

subscriber.subscribe('register', 'login', 'sendCodeEmail', 'updateName', 'changePassword', 'restorePassword');