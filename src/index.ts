import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import sanitizer from "sanitizer";
import cookieParser from "cookie-parser";
import findUser from "./db/findUser";
import setToken from "./token/set";
import checkTokens from "./token/checkTokens";
import lib_PubSub from "./my_library/lib_PubSub";
import microServCB from "./my_library/microServCB";
import middleware from "./middleware";
import jwt from "jsonwebtoken";

require('dotenv').config();

const app = express();

const port = 5050;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const pubSub = new lib_PubSub(microServCB);

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

app.post("/getMessage", (req, res) => {
    let decode: any;

    try {
        decode = jwt.verify(req.cookies.token, process.env.TOKEN);
    } catch (e) {
        try {
            decode = jwt.verify(req.cookies.refreshToken, process.env.TOKEN);
        } catch (e) {
            return res.sendStatus(500);
        }
    }

    if (!decode) {
        return res.sendStatus(403);
    }

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
        sender: (<any>decode).username,
        ...req.body
    }, id);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});