import checkChat from "../db/checkChat";
import AWS from 'aws-sdk';
import {sendMessage} from "./sendMessage";

let credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

let s3 = new AWS.S3();

export default async function sendPhoto(data: any) {
    if (!data) {
        throw new Error("Bad request");
    }

    if (!data.chatId || !data.files) {
        throw new Error("Bad request");
    }

    try {
        await checkChat(data.chatId, data.userId)
    } catch {
        throw new Error("Forbidden")
    }
    let users:any = [];
    for (let i in data.files) {
        let file = data.files[i];
        if (file.mimetype.split('/')[0] === 'image') {
            let base64data = Buffer.from(file.buffer);
            try {
                let result:any = await new Promise((resolve, reject) => {
                    s3.upload({
                        Bucket: "messenger",
                        Key: Date.now() + '-' + file.originalname,
                        Body: base64data,
                        ACL: "public-read",
                    }, async (err:Error, dataAWS:any) => {
                        if (!err) {
                            resolve(dataAWS);
                        } else {
                            reject(err)
                        }
                    });
                });
                let res = await sendMessage(data.userId, data.chatId, result.Location, true);
                users.push({
                    users: res,
                    message: {
                        sender: data.username,
                        name: data.name,
                        chatId: data.chatId,
                        message: result.Location,
                        img: true,
                    },
                });
            } catch (e) {
                console.error(e);
            }


        }
    }

    return users;
}