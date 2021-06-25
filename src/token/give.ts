import jwt from "jsonwebtoken";

export default async function giveToken(username: string, res: any) {
    try {
        let token = await jwt.sign({username: username}, process.env.TOKEN, {expiresIn: '20m'});
        let refreshToken = await jwt.sign({username: username}, process.env.REFRESH_TOKEN, {expiresIn: '14d'});
        res.cookie("token", token, {domain: 'localhost', httpOnly: true})
            .cookie("refreshToken", refreshToken, {domain: 'localhost', httpOnly: true});
    } catch (e) {
        res.send("Error while generate tokens").status(500);
    }
    return;
}