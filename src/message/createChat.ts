import {userModel, chatModel} from "../db/db";
import {Op} from "sequelize";

export default async function createChat(users: any) {
    try {
        users = JSON.parse(users);
    } catch {
        throw new Error("Server error");
    }

    if (users.length < 2) {
        throw new Error("Not enough users")
    }

    const random: number = Math.floor(Math.random() * 100000);
    const now: number = new Date().getTime();
    const id: number = Number.parseInt(now + "" + random);

    let result;

    try {
        result = await userModel.findAll({
            where: {
                [Op.or]: users.map((user: string) => {
                    return {
                        username: user
                    }
                }),
            },
            attributes: ['id', 'username'],
        })
    } catch (e) {
        throw new Error("Server error");
    }

    if (result.length < 2) {
        throw new Error("User or users not found");
    }

    let chat = result.map((elmt: any) => {
        return {
            id_chat: id,
            id_user: elmt.id,
        };
    });
    try {
        await chatModel.bulkCreate(chat);
    } catch (e) {
        throw new Error("Server error");
    }

    if (result.length < users.length) {
        return "Chat was create, but without some users";
    }

    return;
}