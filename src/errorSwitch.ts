export default function errorSwitch(res: any, err: string) {
    switch (err) {
        case "Forbidden":
            res.status(403);
            break;
        case "Bad request":
            res.status(400);
            break;
        case "Cannot update chat":
            res.status(409);
            break;
        case "Message isn't exist":
            res.status(404);
            break;
        case "Not enough or too much users":
            res.status(400);
            break;
        case "User or users not found":
            res.status(403);
            break;
        case "Chat already exist":
            res.status(409);
            break;
        case "Incorrect password":
            res.status(403);
            break;
        default:
            res.status(500);
            break
    }
    res.send(err);
    return;
}