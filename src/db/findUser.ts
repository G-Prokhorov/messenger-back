import UserModel from "./user_db";

export default async function findUser(username: string) {
    let userModel = UserModel();
    return await userModel.findOne({
        where: {
            username: username,
        },
    });
}