import findUser from "../db/findUser";
import bcrypt from "bcrypt";
import updatePassword from "../db/updatePassword";

export default async function changePassword(body:any) {
    if (!body.oldPassword || !body.password || !body.confirm) {
        throw new Error("Bad request");
    }

    let username: string = body.username;
    let oldPass: string = body.oldPassword;
    let password: string = body.password;
    let confirm: string = body.confirm;

    if (oldPass === password) {
        throw new Error("Old and new password cannot match");
    }

    if ((password.length > 50) || (password.length < 6) || (password !== confirm)) {
        throw new Error("Password does not meet the requirement");
    }

    let result: any;

    try {
        result = await findUser(username);
    } catch (e) {
        throw new Error("Server error")
    }

    if (!result) {
        throw new Error("User not found");
    }

    let compare: boolean;
    try {
        compare = await bcrypt.compare(oldPass, result.getDataValue('password'));
    } catch (e) {
        console.error("Error while compare password. " + e)
        throw new Error("Server error");
    }

    if (!compare) {
        throw new Error("Incorrect password");
    }

    return await updatePassword(password, username);
}