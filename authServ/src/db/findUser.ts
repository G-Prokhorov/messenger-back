import {userModel} from "./db";

export default async function findUser(username: string) {
    return await userModel.findOne({
        where: {
            username: username,
        },
    });
}