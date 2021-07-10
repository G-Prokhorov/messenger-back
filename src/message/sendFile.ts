import checkChat from "../db/checkChat";
import AWS from 'aws-sdk';
import {sendMessage} from "./sendMessage";

let credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

let s3 = new AWS.S3();

export default async function sendPhoto(data: any) {
    if (!data.chatId || !data.files) {
        throw new Error("Bad request");
    }

    try {
        await checkChat(data.chatId, data.userId)
    } catch {
        throw new Error("Forbidden")
    }

    for (let i in data.files) {
        let file = data.files[i];
        if (file.mimetype.split('/')[0] === 'image') {
            let base64data = Buffer.from(file.buffer);
            s3.upload({
                Bucket: "messenger",
                Key: Date.now() + '-' + file.originalname,
                Body: base64data,
                ACL: "public-read",
            }, (err:Error, dataAWS:any) => {
                if (!err) {
                    sendMessage(data.userId, data.chatId, dataAWS.Location, true);
                } else {
                    console.error(err);
                }
            });
        }
    }
}