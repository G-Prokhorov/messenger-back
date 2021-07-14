import jwt from "jsonwebtoken";

export default async function giveToken(username: string) {
    try {
        let token = await jwt.sign({username: username}, process.env.TOKEN, {expiresIn: '20m'});
        let refreshToken = await jwt.sign({username: username}, process.env.REFRESH_TOKEN, {expiresIn: '14d'});
        return {
            token: token,
            refreshToken: refreshToken,
        }
    } catch (e) {
        return null;
    }
}