export default function setToken(res: any, tokens: any) {
    if (tokens) {
        res.cookie("token", tokens.token, {domain: 'localhost', httpOnly: true, maxAge: 1200000})
            .cookie("refreshToken", tokens.refreshToken, {domain: 'localhost', httpOnly: true, maxAge: 1209600000});
        return true;
    }

    res.status(500).send("Error while generate tokens");
    return false;
}