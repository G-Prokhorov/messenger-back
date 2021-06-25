import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import sanitizer from "sanitizer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import redisMs from "./microservice library/lib";
import giveToken from "./token/give";
import findUser from "./db/findUser";

require('dotenv').config();

const app = express();
const port = 5050;
const pubSub = new redisMs();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

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

app.post("/login", async (req, res) => {
    let username: string;
    let password: string;

    console.log(req.body);

    if (!req.body.username || !req.body.password) {
        res.sendStatus(400);
        return;
    }

    try {
        username = "@" + sanitizer.escape(req.body.username);
        password = sanitizer.escape(req.body.password);
    } catch {
        res.sendStatus(400);
        return;
    }

    let result = await findUser(username);

    if (!result) {
        res.sendStatus(404);
        return;
    }


    try {
        let compare = await bcrypt.compare(password, result.getDataValue('password'))
        if (compare) {
            await giveToken(username, res);
            console.log("here");
            res.status(200).send("login");
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        res.send("Error while login user, " + e).status(500);
    }

    return;
});

app.post("/register", async (req, res) => {

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

app.get("/checkTokens", middleware, (req, res) => res.sendStatus(200));

app.post("/test", async (req, res, next) => {
    let id = pubSub.subscribe("resTest", (status: number, message: string) => res.status(status).send(message));
    pubSub.publish("test", {
        text: "hello"
    }, id);
});

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
            await giveToken((<any>decode).username, res);
            next();
        } catch (e) {
            res.status(422).send("Token isn't valid");
            return;
        }
    }
}
