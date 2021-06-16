import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import sanitizer from "sanitizer";
import { Sequelize, Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

require('dotenv').config();

const app = express();
const port = 5000;
const saltRounds = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const sequelize = new Sequelize(`postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/messenger`);

const User = sequelize.define("users", {
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Anonymous',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    let email: string;
    let password: string;
    let confirm: string;

    try {
        email = sanitizer.escape(req.body.email);
        password = sanitizer.escape(req.body.password);
        confirm = sanitizer.escape(req.body.confirm);
    } catch {
        res.sendStatus(400);
        return;
    }

    if (!email || !password || !confirm) {
        res.sendStatus(400);
        return;
    }

    if (!validateEmail(email) || (password.length > 30) || (password.length < 6) || (password !== confirm)) {
        res.sendStatus(403);
        return;
    }

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        await User.create({
            email: email,
            password: hash,
        });
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(403);
        console.log("Error while register new user, " + err);
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}