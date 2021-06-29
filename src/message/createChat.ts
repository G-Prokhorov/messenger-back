import {userModel, chatModel} from "../db/db";
import sequelize, {Op} from "sequelize";
import {v4 as uuidv4} from 'uuid';

export default async function createChat(users: any) {
    try {
        users = JSON.parse(users);
    } catch {
        throw new Error("Server error");
    }

    if (users.length !== 2) {
        throw new Error("Not enough or too much users")
    }

    const id: string = uuidv4();

    let result;

    users = users.map((user: string) => {
        return {
            username: user
        }
    });

    try {
        result = await userModel.findAll({
            where: {
                [Op.or]: users,
            },
            attributes: ['id', 'username'],
        })
    } catch (e) {
        throw new Error("Server error");
    }

    if (result.length !== 2) {
        throw new Error("User or users not found");
    }

    let check: any;
    let users_id = result.map((user: any) => {
        return {
            id_user: user.id
        }
    });

    try {
        check = await chatModel.findAll({
            attributes: ['id_chat'],
            where: {
                [Op.or]: users_id,
            },
            group: ['id_chat'],
            having: sequelize.literal('count(id_user) = 2'),
        });
    } catch (e) {
        console.log(e);
        throw new Error("Server error");
    }

    if (check.length !== 0) {
        throw new Error("Chat already exist");
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

    // if (result.length < users.length) {
    //     return "Chat was create, but without some users";
    // }

    return;
}