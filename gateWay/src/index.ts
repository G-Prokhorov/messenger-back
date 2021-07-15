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
import errorSwitch from "./errorSwitch";
import multer from "multer";
import path from "path";

require('dotenv').config();

const app = express();
const fileSize = 500000000000000000000000000000000000000000;
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
app.use(express.static(__dirname + "/../public"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/../public/index.html");
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
            errorSwitch(res, err);
            return;
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

app.get("/checkTokens", middleware, (req, res) => res.send({
    //@ts-ignore
    username: req.userName,
    //@ts-ignore
    name: req.u_name,
    //@ts-ignore
    email: req.emailUser,
}));

app.put("/createChat", middleware, (req, res) => {
    const id = pubSub.subscribe("resCreateChat", (err: string, message: string) => {
        if (err !== 'success') {
            errorSwitch(res, err);
            return;
        }

        if (message) {
            return res.status(200).send(message);
        }

        return res.sendStatus(200);
    });

    pubSub.publish("createChat", {
        ...req.body,
        //@ts-ignore
        creator: req.userName
    }, id);
});

app.post("/getMessage", middleware, (req, res) => {
    const id = pubSub.subscribe("resGetMessage", async (err: string, message: string) => {
        if (err !== 'success') {
            errorSwitch(res, err);
            return;
        }

        return res.status(200).send(message);
    });

    pubSub.publish("getMessage", {
        //@ts-ignore
        userId: req.userId,
        //@ts-ignore
        sender: req.userName,
        ...req.body
    }, id);
});

app.patch("/markRead", middleware, (req, res) => {
    const id = pubSub.subscribe("resMarkRead", async (err: string, message: string) => {
        if (err !== 'success') {
            errorSwitch(res, err);
            return;
        }

        return res.status(200).send(message);
    });

    pubSub.publish("markRead", {
        //@ts-ignore
        userId: req.userId,
        //@ts-ignore
        username: req.userName,
        ...req.body
    }, id);
});

app.get("/getChat", middleware, (req, res) => {
    const id = pubSub.subscribe("resGetChats", async (err: string, message: string) => {
        if (err !== 'success') {
            errorSwitch(res, err);
            return;
        }

        return res.status(200).send(message);
    });

    pubSub.publish("getChats", {
        //@ts-ignore
        userId: req.userId,
        //@ts-ignore
        username: req.userName,
    }, id);
});

const storage = multer.memoryStorage();
const upload = multer({storage: storage, limits: {fileSize: fileSize}});

app.post("/sendPhoto", middleware, upload.any(), (req, res) => {
    const id = pubSub.subscribe("resSendPhoto", async (err: string, message: string) => {
        if (err !== 'success') {
            errorSwitch(res, err);
            return;
        }

        return res.sendStatus(200);
    });

    pubSub.publish("sendPhoto", {
        //@ts-ignore
        userId: req.userId,
        //@ts-ignore
        username: req.userName,
        //@ts-ignore
        name: req.u_name,
        chatId: req.body.chatId,
        files: {...req.files},
    }, id);
});

app.post("/sendCodeEmail/:type", async (req, res) => {
    if (req.params.type !== "register" && req.params.type !== "restore") {
        res.sendStatus(403);
    }

    const id = pubSub.subscribe("resSendCodeEmail", (err: string, message: string) => {
        if (err !== 'success') {
            errorSwitch(res, err);
            return;
        }

        return res.sendStatus(200);
    });

    pubSub.publish("sendCodeEmail", {...req.body, type: req.params.type}, id);
});

app.patch("/updateName", middleware, (req, res) => {
    const id = pubSub.subscribe("resUpdateName", async (err: string, message: string) => {
        if (err !== 'success') {
            errorSwitch(res, err);
            return;
        }

        return res.sendStatus(200);
    });

    pubSub.publish("updateName", {
        //@ts-ignore
        userId: req.userId,
        name: req.body.name,
    }, id);
});

app.patch("/changePassword", middleware, (req, res) => {
    const id = pubSub.subscribe("resChangePassword", (err: string, message: string) => {
        if (err !== 'success') {
            errorSwitch(res, err);
            return;
        }

        return res.sendStatus(200);
    });

    pubSub.publish("changePassword", {
        //@ts-ignore
        username: req.userName,
        ...req.body,
    }, id);
})

app.patch("/restorePassword", (req, res) => {
    const id = pubSub.subscribe("resRestorePassword", (err: string, message: string) => {
        if (err !== 'success') {
            errorSwitch(res, err);
            return;
        }

        return res.sendStatus(200);
    });

    pubSub.publish("restorePassword", req.body, id);
});

app.get("*", (req, res) => {
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});