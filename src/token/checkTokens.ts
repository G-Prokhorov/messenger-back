import jwt from "jsonwebtoken";
import findUser from "../db/findUser";
import giveToken from "./give";

export default async function checkTokens(token: string, refresh: string) {
    try {
        let decode = jwt.verify(token, process.env.TOKEN);
        let check = await findUser((<any>decode).username);
        if (!check) {
            throw new Error("User not exist");
        }
        return [null, (<any>decode).username, check.id];
    } catch (e) {
        if (e.message === "User not exist") {
            throw e;
        }

        try {
            let decode = jwt.verify(refresh, process.env.REFRESH_TOKEN);
            let check = await findUser((<any>decode).username);
            if (!check) {
                throw new Error("User not exist");
            }
            return [await giveToken((<any>decode).username), (<any>decode).username, check.id];
        } catch (e) {
            throw new Error(e.message === "User not exist" ? "User not exist" : "Token isn't valid");
        }
    }
}