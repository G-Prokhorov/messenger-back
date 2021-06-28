import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import sanitizer from "sanitizer";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import redisMs from "./ms_library/lib";
import giveToken from "./token/give";
import findUser from "./db/findUser";
import setToken from "./token/set";
import http from "http";
import WebSocket from "ws";
import checkTokens from "./token/checkTokens";

require('dotenv').config();

const app = express();

const port = 5050;
const WSport = 5055;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())


const pubSub = new redisMs();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:8080",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Special-Request-Header",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.post(["/register", "/login"], (req, res) => {
    let pub: string;
    let sub: string;
    if (req.path === "/register") {
        sub = "resRegister";
        pub = "register";
    } else {
        sub = "resLogin";
        pub = "login";
    }

    let id = pubSub.subscribe(sub, (err: string, message: string) => {
        if (err !== 'success') {
            console.log(err);
            switch (err) {
                case "Bad request":
                    res.status(400);
                    break;
                case "User not found":
                    res.status(404);
                    break;
                case "Incorrect password":
                    res.status(403);
                    break;
                default:
                    res.status(500);
                    break
            }
            return res.send(err);
        }
        setToken(res, message);
        return res.end();
    });
    pubSub.publish(pub, req.body, id);
});

app.get("/checkUser", async (req, res) => {
    let username: string;

    if (!req.query.username) {
        res.sendStatus(400);
        return;
    }

    try {
        username = "@" + sanitizer.escape(String(req.query.username));
    } catch {
        res.sendStatus(400);
        return;
    }

    let result = await findUser(username);
    if (result) {
        res.send("exist");
    } else {
        res.send("clear");
    }
    return;
});

app.get("/logout", (req, res) => res.clearCookie("token")
    .clearCookie("refreshToken").status(200).send("clear"));

app.get("/checkTokens", middleware, (req, res) => res.sendStatus(200));

app.post("/createChat", middleware, (req, res) => {
    const id = pubSub.subscribe("resCreateChat", (err: string, message: string) => {
        if (err !== 'success') {
            switch (err) {
                case "Not enough users":
                    res.status(400);
                    break;
                case "User or users not found":
                    res.status(403);
                    break;
                default:
                    res.status(500);
                    break
            }
            return res.send(err);
        }

        if (message) {
            return res.status(200).send(message);
        }

        return res.sendStatus(200);
    });

    pubSub.publish("createChat", req.body, id);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


///// WS ///////
const server = http.createServer(app);

const webSocketServer = new WebSocket.Server({server});

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

    let username;

    try {
        let result = await checkTokens(token, refreshToken);
        if (result) {
            username = jwt.verify(result.token, process.env.TOKEN);
        } else {
            username = jwt.verify(token, process.env.TOKEN);
        }
    } catch (e) {
        ws.close(1003, e.message);
        return;
    }

    ws.on('message', m => {
        ws.send(m)
    });

    ws.on("error", e => ws.send(e));

    ws.send('Connect!');
});

server.listen(WSport, () => console.log("WebSocket started"));

///// WS ///////

async function middleware(req: any, res: any, next: any) {
    let token;
    let refresh;
    try {
        token = sanitizer.escape(req.cookies.token);
        refresh = sanitizer.escape(req.cookies.refreshToken);
    } catch (e) {
        res.sendStatus(500);
        return;
    }
    if (!token && !refresh) {
        res.sendStatus(403);
        return;
    }

    try {
        let result = await checkTokens(token, refresh);
        if (result) {
            setToken(res, result);
        }
        next();
    } catch (e) {
        switch (e.message) {
            case "User not exist":
                res.status(422).send(e.message);
                break;
            case "Token isn't valid":
                res.status(403).send(e.message);
                break;
            default:
                res.sendStatus(500);
                break;
        }
        return
    }

}



