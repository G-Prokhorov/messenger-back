import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import sanitizer from "sanitizer";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import redisMs from "./microservice library/lib";
import giveToken from "./token/give";
import findUser from "./db/findUser";
import setToken from "./token/set";

require('dotenv').config();

const app = express();

const port = 5050;


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

app.post(["/register", "/login"], async (req, res) => {
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

app.get("/logout", (req, res) => res.clearCookie("token").clearCookie("refreshToken").status(200).send("clear"));

// app.post("/test", async (req, res, next) => {
//     subscriber.subscribe("resTest")
//     try {
//         publisher.publish("test", JSON.stringify({
//             message: "Hello world",
//         }));
//         subscriber.on("message", async (channel, message) => {
//             console.log("message resTest")
//             if (channel === "resTest") {
//                 subscriber.unsubscribe();
//                 let messageObj = JSON.parse(message);
//                 res.status(messageObj.status).json(messageObj.text);
//                 return;
//             }
//         });
//
//     } catch (e) {
//         console.error(e);
//         res.sendStatus(500);
//         return;
//     }
// });

app.get("/checkTokens", middleware, (req, res) => res.sendStatus(200));


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

async function middleware(req: any, res: any, next: any) {
    let token = sanitizer.escape(req.cookies.token);
    let refresh = sanitizer.escape(req.cookies.refreshToken);

    if (!token || !refresh) {
        res.sendStatus(403);
        return;
    }

    try {
        let decode = jwt.verify(token, process.env.TOKEN);
        let check = await findUser((<any>decode).username);
        if (!check) {
            res.status(422).send("User not exist");
            return;
        }
        next();
    } catch (e) {
        try {
            let decode = jwt.verify(refresh, process.env.REFRESH_TOKEN);
            let check = await findUser((<any>decode).username);
            if (!check) {
                res.status(422).send("User not exist");
                return;
            }
            let tokens = await giveToken((<any>decode).username);
            setToken(res, tokens);
            next();
        } catch (e) {
            res.status(422).send("Token isn't valid");
            return;
        }
    }
}
