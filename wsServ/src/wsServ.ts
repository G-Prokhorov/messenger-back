import http from "http";
import WebSocket from "ws";
import sanitizer from "sanitizer";
import checkTokens from "./token/checkTokens";
import lib_PubSub from "./my_library/lib_PubSub";
import userAlertCB from "./my_library/userAlertCB";

const server = http.createServer();

const webSocketServer = new WebSocket.Server({server});

const WSport = 5055;
const pubSub = new lib_PubSub(userAlertCB);

webSocketServer.on('connection', async (ws, req) => {
    if (!req.headers.cookie) {
        ws.close(1003);
    }
    let cookie = sanitizer.escape(req.headers.cookie);
    let token = null, refreshToken = null;
    try {
        cookie.split(";").forEach(str => {
            let nameCookie = str.split("=")[0];
            if (nameCookie.includes("token")) {
                token = str.split("=")[1].replace(";", "");
            } else if (nameCookie.includes("refreshToken")) {
                refreshToken = str.split("=")[1].replace(";", "");
            }
        });
    } catch {
        ws.close(1003);
    }


    let username:string;
    let nameU: string

    try {
        let [result, decode, id, name] = await checkTokens(token, refreshToken);
        username = decode;
        nameU = name;
    } catch (e) {
        ws.close(1003, e.message);
        return;
    }

    let id:number = pubSub.subscribe(username, (err:string, obj:any, idSender: number) => {
        if (err !== "success") {
            ws.send("Error. " + err);
            return;
        } else if (idSender !== id) {
            ws.send(obj);
        }
    }, false);

    ws.on('message', (m:string) => {
        let parse: any;
        try {
            parse = JSON.parse(m)
        } catch {
            ws.send("Server error");
            return;
        }
        switch (parse.action) {
            case "send message":
                if (!parse.data.chatId || !parse.data.message) {
                    ws.send("Bad request");
                }

                pubSub.publish("sendMessage", {
                    sender: username,
                    name: nameU,
                    ...parse.data
                }, id);
                break;
            default:
                ws.send("Unknown method");
                break;
        }
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

server.listen(WSport, "ws",() => console.log("WebSocket started"));
