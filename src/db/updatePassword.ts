import cryptPassword from "../auth/cryptPassword";
import {userModel} from "./db";

export default async function updatePassword(password: string, search: string, email: boolean = false) {
    try {
        let hash = await cryptPassword(password);
        let result = await userModel.update({
            password: hash,
        }, {
            where: email ? {email: search} : { username: search },
            returning: true,
        });
        if (result.length === 0) {
            throw "Cannot update password";
        }
        return;
    } catch (e) {
        console.error("Error while update user's info. " + e);
        if (e === "Cannot update password") {
            throw new Error("Cannot update password");
        }
        throw new Error("Server error");
    }
}