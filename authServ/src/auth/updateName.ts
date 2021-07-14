import {userModel} from "../db/db";

export default async function updateName(data: any) {
    if (!data.userId || !data.name) {
        throw new Error("Bad request");
    }

    try {
        await userModel.update({
           name: data.name
        }, {
            where: {
                id: data.userId,
            }
        });
    } catch (e) {
        throw new Error("Server error");
    }

    return;
}