export default function setToken(res: any, tokens: any) {
    let twenty = new Date();
    let fortnite = new Date();
    let now = twenty.getTime();
    twenty.setTime(20 * 60 + now);
    fortnite.setTime(24 * 60 * 60 * 14 + now)
    if (tokens) {
        res.cookie("token", tokens.token, {domain: 'localhost', httpOnly: true, expires: twenty.toUTCString()})
            .cookie("refreshToken", tokens.refreshToken, {domain: 'localhost', httpOnly: true, expires: fortnite.toUTCString()});
        return true;
    }

    res.send("Error while generate tokens").status(500);
    return false;
}