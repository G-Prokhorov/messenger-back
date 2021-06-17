import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import sanitizer from "sanitizer";
import {Sequelize, Model, DataTypes} from "sequelize";
import bcrypt from "bcrypt";

require('dotenv').config();

const app = express();
const port = 5000;
const saltRounds = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

// (async function checkConnectDB() {
//     try {
//         await sequelize.authenticate();
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })();

app.use(cors({
    // @ts-ignore
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
}));


app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.post("/register", async (req, res) => {
    let username: string;
    let password: string;
    let confirm: string;

    let re = new RegExp("^[a-zA-Z0-9_.-]*$")

    if (!re.test(String(req.body.username))) {
        res.sendStatus(403).send("Password must not include special characters");
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

    if (!username || !password || !confirm) {
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
        res.sendStatus(403).send("Error while register new user, " + err);
        return;
    }

    res.sendStatus(200);
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

    let result = await User.findOne({
        where: {
            username: username,
        },
    });

    if (result) {
        res.sendStatus(409);
    } else {
        res.sendStatus(200);
    }

    return;
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
