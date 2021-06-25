import User from "./user_db";

export default async function findUser(username: string) {
    return await User.findOne({
        where: {
            username: username,
        },
    });
}