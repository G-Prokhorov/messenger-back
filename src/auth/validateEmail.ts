import nodemailer from "nodemailer";
import redis from "redis";
import crypto from 'crypto';
const client = redis.createClient();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    }
});

export default async function validateEmail(body: any) {
    if (!body.email) {
        throw new Error("Bad request")
    }

    try {
        await new Promise((resolve, reject) => client.get(body.email, (err, data: any) => {
            if (err) {
                console.error(err);
                return reject("Server error");
            }

            let value: any;
            try {
                value = JSON.parse(data);
            } catch (e) {
                console.log("here")
                return reject("Server error");
            }

            if (!value) {
                return resolve("Clear");
            }

            if (Date.now() >= parseInt(value.lifeTime) || !value.code) {
                return resolve("Generate new");
            }

            return reject("Code already exist");
        }));
    } catch (e) {
        throw new Error(e);
    }

    let mailOptions;
    let code: string;
    try {
        code = await generateCode();
        await new Promise((resolve, reject) => client.set(body.email, JSON.stringify({
            code: code,
            lifeTime: addMinutes(2),
            type: "register",
        }), "EX", 60 * 10, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve("ok");
        }));
        mailOptions = {
            from: 'prkhrv.messenger@gmail.com',
            to: body.email,
            subject: 'Confirm mail to complete registration.',
            html: '<h1>Hello!</h1>' +
                '<b>Your code: </b>' + code
        };
    } catch (e) {
        console.error("Error while generate token for validation email. " + e);
        throw new Error("Server error");
    }


    try {
        await transporter.sendMail(mailOptions)
    } catch (e) {
        console.error("Error while send mail. " + e);
        throw new Error("Server error");
    }
}

async function generateCode(): Promise<any> {
    let token = await crypto.randomBytes(12);
    return token.toString('hex');
}

function addMinutes(minutes: number) {
    return new Date(Date.now() + minutes * 60000).getTime();
}