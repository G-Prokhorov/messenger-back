import nodemailer from "nodemailer";
import crypto from 'crypto';
import {checkKey, setKey} from "./key";


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    }
});

export default async function sendCodeEmail(body: any) {
    if (!body) {
        throw new Error("Bad request");
    }

    if (!body.email) {
        throw new Error("Bad request")
    }

    let type = body.type;

    try {
        await checkKey(type, body.email);
    } catch (e) {
        throw new Error(e);
    }

    let mailOptions;
    let code: string;
    try {
        code = await generateCode();
        await setKey(type, body.email, code);
        mailOptions = {
            from: 'prkhrv.messenger@gmail.com',
            to: body.email,
            subject: type === "register" ? 'Confirm mail to complete registration.' : 'Your code to restore password.',
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
        throw new Error("Cannot send on this email");
    }
}

async function generateCode(): Promise<any> {
    let token = await crypto.randomBytes(12);
    return token.toString('hex');
}