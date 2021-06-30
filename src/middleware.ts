import sanitizer from "sanitizer";
import checkTokens from "./token/checkTokens";
import setToken from "./token/set";

export default async function middleware(req: any, res: any, next: any) {
    let token;
    let refresh;
    try {
        token = sanitizer.escape(req.cookies.token);
        refresh = sanitizer.escape(req.cookies.refreshToken);
    } catch (e) {
        res.sendStatus(500);
        return;
    }
    if (!token && !refresh) {
        res.sendStatus(403);
        return;
    }

    try {
        let result = await checkTokens(token, refresh);
        if (result) {
            setToken(res, result);
        }
        next();
    } catch (e) {
        switch (e.message) {
            case "User not exist":
                res.status(422).send(e.message);
                break;
            case "Token isn't valid":
                res.status(403).send(e.message);
                break;
            default:
                res.sendStatus(500);
                break;
        }
        return
    }

}