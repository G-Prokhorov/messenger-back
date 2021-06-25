import sanitizer from "sanitizer";
import bcrypt from "bcrypt";

const saltRounds = 10;

export default async function register(req: any, publisher: any) {
    let username: string;
    let password: string;
    let confirm: string;

    if (!req.body.username || !req.body.password || !req.body.confirm) {
        res.sendStatus(400);
        return;
    }

    let re = new RegExp("^[a-zA-Z0-9_.-]*$")

    if (!re.test(String(req.body.username))) {
        res.status(403).send("Password must not include special characters");
        return;
    }

    try {
        username = "@" + sanitizer.escape(req.body.username);
        password = sanitizer.escape(req.body.password);
        confirm = sanitizer.escape(req.body.confirm);
    } catch {
        res.sendStatus(400);
        return;
    }

    if ((username.length > 51) || (password.length > 30) || (password.length < 6) || (password !== confirm)) {
        res.sendStatus(403);
        return;
    }

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        let result = await User.findOrCreate({
            where: {
                username: username,
            },
            defaults: {
                password: hash,
            },
        });

        if (!result.pop()) {
            res.sendStatus(409);
            return;
        }
    } catch (err) {
        res.send("Error while register new user, " + err).status(500);
        return;
    }

    try {
        await giveToken(username, res);
    } catch (e) {
        res.send(e).status(500);
    }
    return;
}