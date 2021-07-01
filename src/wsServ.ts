import http from "http";
import WebSocket from "ws";
import sanitizer from "sanitizer";
import checkTokens from "./token/checkTokens";
import jwt from "jsonwebtoken";
import lib_PubSub from "./my_library/lib_PubSub";
import userAlertCB from "./my_library/userAlertCB";

const server = http.createServer();

const webSocketServer = new WebSocket.Server({server});

const WSport = 5055;
const pubSub = new lib_PubSub(userAlertCB);

webSocketServer.on('connection', async (ws, req) => {
    let cookie = sanitizer.escape(req.headers.cookie);
    let token = null, refreshToken = null;
    cookie.split(";").forEach(str => {
        let nameCookie = str.split("=")[0];
        if (nameCookie.includes("token")) {
            token = str.split("=")[1].replace(";", "");
        } else if (nameCookie.includes("refreshToken")) {
            refreshToken = str.split("=")[1].replace(";", "");
        }
    });

    let username:string;

    try {
        let [result, decode] = await checkTokens(token, refreshToken);
        username = decode;
    } catch (e) {
        ws.close(1003, e.message);
        return;
    }

    let id:number = pubSub.subscribe(username, (err:string, obj:any) => {
        if (err !== "success") {
            ws.send("Error. " + err);
            return;
        }

        console.log(obj)
        ws.send(obj.message + ", " + obj.chatId);
    });

    ws.on('message', (m:string) => {
        let parse: any;
        try {
            parse = JSON.parse(m)
            if (!parse.chatId || !parse.message) {
                throw new Error("Bad request");
            }
        } catch {
            ws.send("Bad request");
            return;
        }
        pubSub.publish("sendMessage", {
            sender: username,
            ...parse
        });
    });

    ws.on("close", () => {
        try {
            pubSub.unsubscribe(username, id)
        } catch (e) {
            console.error("Error when close ws. " + e)
        }
    });

    ws.on("error", e => ws.send(e));

    ws.send('Connect!');
});

server.listen(WSport, () => console.log("WebSocket started"));
