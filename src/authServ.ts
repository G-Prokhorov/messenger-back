import redis from "redis";
import register from "./auth/register";
import login from "./auth/login";
import postFunc from "./post";
import validateEmail from "./auth/validateEmail";
import updateName from "./auth/updateName";
import changePassword from "./auth/changePassword";

let publisher = redis.createClient();
const subscriber = redis.createClient();

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
            case "validateEmail":
                try {
                    await validateEmail(messageParse.message);
                    post("resValidateEmail");
                } catch (e) {
                    post("resValidateEmail", null, e.message);
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
        }
    } catch (e) {
        console.error("Error while test microservice. ", + e)
    }
});

subscriber.subscribe('register', 'login', 'validateEmail', 'updateName', 'changePassword');