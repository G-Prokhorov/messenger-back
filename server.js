"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const sanitizer_1 = __importDefault(require("sanitizer"));
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require('dotenv').config();
const app = express_1.default();
const port = 5050;
const saltRounds = 10;
// const publisher = redis.createClient();
// const subscriber = redis.createClient();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
// should add auto restart if db dont start in one try
const sequelize = new sequelize_1.Sequelize(`postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/messenger`);
const User = sequelize.define("users", {
    username: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Anonymous',
    },
});
const corsOptions = {
    origin: "http://localhost:8080",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Special-Request-Header",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors_1.default(corsOptions));
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username;
    let password;
    console.log(req.body);
    if (!req.body.username || !req.body.password) {
        res.sendStatus(400);
        return;
    }
    try {
        username = "@" + sanitizer_1.default.escape(req.body.username);
        password = sanitizer_1.default.escape(req.body.password);
    }
    catch (_a) {
        res.sendStatus(400);
        return;
    }
    let result = yield findUser(username);
    if (!result) {
        res.sendStatus(404);
        return;
    }
    try {
        let compare = yield bcrypt_1.default.compare(password, result.getDataValue('password'));
        if (compare) {
            yield giveToken(username, res);
            console.log("here");
            res.status(200).send("login");
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (e) {
        res.send("Error while login user, " + e).status(500);
    }
    return;
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username;
    let password;
    let confirm;
    if (!req.body.username || !req.body.password || !req.body.confirm) {
        res.sendStatus(400);
        return;
    }
    let re = new RegExp("^[a-zA-Z0-9_.-]*$");
    if (!re.test(String(req.body.username))) {
        res.status(403).send("Password must not include special characters");
        return;
    }
    try {
        username = "@" + sanitizer_1.default.escape(req.body.username);
        password = sanitizer_1.default.escape(req.body.password);
        confirm = sanitizer_1.default.escape(req.body.confirm);
    }
    catch (_b) {
        res.sendStatus(400);
        return;
    }
    if ((username.length > 51) || (password.length > 30) || (password.length < 6) || (password !== confirm)) {
        res.sendStatus(403);
        return;
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const hash = yield bcrypt_1.default.hash(password, salt);
        let result = yield User.findOrCreate({
            where: {
                username: username,
            },
            defaults: {
                password: hash,
            },
        });
        if (!result.pop()) {
            res.sendStatus(409);
            return;
        }
    }
    catch (err) {
        res.send("Error while register new user, " + err).status(500);
        return;
    }
    try {
        yield giveToken(username, res);
    }
    catch (e) {
        res.send(e).status(500);
    }
    return;
}));
app.get("/checkUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username;
    if (!req.query.username) {
        res.sendStatus(400);
        return;
    }
    try {
        username = "@" + sanitizer_1.default.escape(String(req.query.username));
    }
    catch (_c) {
        res.sendStatus(400);
        return;
    }
    let result = yield findUser(username);
    if (result) {
        res.send("exist");
    }
    else {
        res.send("clear");
    }
    return;
}));
app.get("/logout", (req, res) => {
    res.clearCookie("token").clearCookie("refreshToken").status(200).send("clear");
    return;
});
app.get("/checkTokens", middleware, (req, res) => {
    console.log("here");
    res.sendStatus(200);
});
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
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
function giveToken(username, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("generate new");
        try {
            let token = yield jsonwebtoken_1.default.sign({ username: username }, process.env.TOKEN, { expiresIn: '20m' });
            let refreshToken = yield jsonwebtoken_1.default.sign({ username: username }, process.env.REFRESH_TOKEN, { expiresIn: '14d' });
            res.cookie("token", token, { domain: 'localhost', httpOnly: true })
                .cookie("refreshToken", refreshToken, { domain: 'localhost', httpOnly: true });
        }
        catch (e) {
            res.send("Error while generate tokens").status(500);
        }
        return;
    });
}
function middleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = sanitizer_1.default.escape(req.cookies.token);
        let refresh = sanitizer_1.default.escape(req.cookies.refreshToken);
        if (!token || !refresh) {
            res.sendStatus(403);
            return;
        }
        try {
            let decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN);
            let check = yield findUser(decode.username);
            if (!check) {
                res.status(422).send("User not exist");
                return;
            }
            next();
        }
        catch (e) {
            try {
                let decode = jsonwebtoken_1.default.verify(refresh, process.env.REFRESH_TOKEN);
                let check = yield findUser(decode.username);
                if (!check) {
                    res.status(422).send("User not exist");
                    return;
                }
                yield giveToken(decode.username, res);
                next();
            }
            catch (e) {
                res.status(422).send("Token isn't valid");
                return;
            }
        }
    });
}
function findUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield User.findOne({
            where: {
                username: username,
            },
        });
    });
}
//# sourceMappingURL=index.js.map