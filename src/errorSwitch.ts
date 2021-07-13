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
        case "Code already exist":
            res.status(409);
            break;
        case "Incorrect password":
            res.status(403);
            break;
        case "Key not exist":
            res.status(404);
            break;
        case "Keys don't match" :
            res.status(401);
            break;
        case "User exist":
            res.status(409);
            break;
        case "Password does not meet the requirement":
            res.status(400);
            break;
        case "Old and new password cannot match":
            res.status(400);
            break;
        case "Service Unavailable":
            res.status(503);
            break;
        default:
            res.status(500);
            break
    }
    res.send(err);
    return;
}