import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import cookieParser from "cookie-parser";
import findUser from "./db/findUser";
import setToken from "./token/set";
import lib_PubSub from "./my_library/lib_PubSub";
import microServCB from "./my_library/microServCB";
import middleware from "./middleware/middleware";
import sanitizeMiddlewareBody from "./middleware/sanitizeMiddlewareBody";
import sanitizeMiddleware from "./middleware/sanitizeMiddleware";

require('dotenv').config();

const app = express();

const port = 5050;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(sanitizeMiddleware);
app.use(/\/((?!createChat).)*/, sanitizeMiddlewareBody);

const pubSub = new lib_PubSub(microServCB);


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
        username = "@" + req.query.username;
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
                case "Not enough or too much users":
                    res.status(400);
                    break;
                case "User or users not found":
                    res.status(403);
                    break;
                case "Chat already exist":
                    res.status(409);
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
});

app.post("/getMessage", middleware, (req, res) => {
    const id = pubSub.subscribe("resGetMessage", async (err: string, message: string) => {
        console.log("here")
        if (err !== 'success') {
            switch (err) {
                case "Forbidden":
                    res.status(403);
                    break;
                case "Bad request":
                    res.status(400);
                    break;
                case "User not exist":
                    res.status(404);
                    break;
                case "Message isn't exist":
                    res.status(404);
                    break;
                default:
                    res.status(500);
                    break
            }
            return res.send(err);
        }

        return res.status(200).send(message);
    });

    pubSub.publish("getMessage", {
        //@ts-ignore
        sender: req.userName,
        ...req.body
    }, id);
});

app.patch("/markRead", middleware, (req, res) => {
    const id = pubSub.subscribe("resMarkRead", async (err: string, message: string) => {
        if (err !== 'success') {
            switch (err) {
                case "Forbidden":
                    res.status(403);
                    break;
                case "Bad request":
                    res.status(400);
                    break;
                case "User not exist":
                    res.status(404);
                    break;
                case "Cannot update chat":
                    res.status(409);
                    break;
                default:
                    res.status(500);
                    break
            }
            return res.send(err);
        }

        return res.status(200).send(message);
    });

    pubSub.publish("markRead", {
        //@ts-ignore
        username: req.userName,
        ...req.body
    }, id);
});

app.get("/getChat", middleware, (req, res) => {
    const id = pubSub.subscribe("resGetChats", async (err: string, message: string) => {
        if (err !== 'success') {
            switch (err) {
                case "Forbidden":
                    res.status(403);
                    break;
                case "Bad request":
                    res.status(400);
                    break;
                case "User not exist":
                    res.status(404);
                    break;
                default:
                    res.status(500);
                    break
            }
            return res.send(err);
        }

        return res.status(200).send(message);
    });

    pubSub.publish("getChats", {
        //@ts-ignore
        username: req.userName,
    }, id)
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});