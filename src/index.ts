import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import sanitizer from "sanitizer";
import {DataTypes, Sequelize} from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

require('dotenv').config();

const app = express();
const port = 5000;
const saltRounds = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const sequelize = new Sequelize(`postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/messenger`);

const User = sequelize.define("users", {
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Anonymous',
    },
});

app.use(cors({
    // @ts-ignore
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
}));


app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.post("/login", async (req, res) => {
    let username: string;
    let password: string;

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
    }


    try {
        let compare = await bcrypt.compare(password, result.getDataValue('password'))

        if (compare) {
            await giveToken(username, res);
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        res.send("Error while login user, " + e).status(500);
    }

    return;
});

app.post("/register", async (req, res) => {
    let username: string;
    let password: string;
    let confirm: string;

    if (!req.body.username || !req.body.password || !req.body.confirm) {
        res.sendStatus(400);
        return;
    }

    let re = new RegExp("^[a-zA-Z0-9_.-]*$")

    if (!re.test(String(req.body.username))) {
        res.status(403).send("Password must not include special characters");
        return;
    }

    try {
        username = "@" + sanitizer.escape(req.body.username);
        password = sanitizer.escape(req.body.password);
        confirm = sanitizer.escape(req.body.confirm);
    } catch {
        res.sendStatus(400);
        return;
    }

    if ((username.length > 51) || (password.length > 30) || (password.length < 6) || (password !== confirm)) {
        res.sendStatus(403);
        return;
    }

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        let result = await User.findOrCreate({
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
    } catch (err) {
        res.status(500).send("Error while register new user, " + err);
        return;
    }

    try {
        await giveToken(username, res);
    } catch (e) {
        res.send(e).sendStatus(500);
    }
    return;
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

app.post("/checkTokens", middleware, (req, res) => {
    console.log("here");
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

async function giveToken(username: string, res: any) {
    console.log("generate new");
    try {
        let token = await jwt.sign({username: username}, process.env.TOKEN, {expiresIn: '20m'});
        let refreshToken = await jwt.sign({username: username}, process.env.REFRESH_TOKEN, {expiresIn: '14d'});
        res.cookie("token", token, {domain: 'localhost', httpOnly: true})
            .cookie("refreshToken", refreshToken, {domain: 'localhost', httpOnly: true});
    } catch (e) {
        res.send("Error while generate tokens").status(500);
    }
    return;
}

async function middleware(req: any, res: any, next: any) {
    let token = sanitizer.escape(req.cookies.token);
    let refresh = sanitizer.escape(req.cookies.refreshToken);

    try {
        let decode = jwt.verify(token, process.env.TOKEN);
        let check = await findUser((<any>decode).username);
        if (!check) {
            res.send("User not exist").status(422);
            return;
        }
        next();
    } catch (e) {
        try {
            let decode = jwt.verify(refresh, process.env.REFRESH_TOKEN);
            let check = await findUser((<any>decode).username);
            if (!check) {
                res.send("User not exist").status(422);
                return;
            }
            await giveToken((<any>decode).username, res);
            next();
        } catch (e) {
            res.send("Token isn't valid").status(422);
            return;
        }
    }
}

async function findUser(username: string) {
    return await User.findOne({
        where: {
            username: username,
        },
    });
}
