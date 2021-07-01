import sanitizer from "sanitizer";

export default function sanitizeMiddleware(req: any, res: any, next: any) {
    console.log("sanitize");
    for (let val in req.body) {
        try {
            req.body[val] = sanitizer.escape(req.body[val]);
        } catch {
            res.sendStatus(500);
            return;
        }
    }

    for (let val in req.cookies) {
        try {
            req.cookies[val] = sanitizer.escape(req.cookies[val]);
        } catch {
            res.sendStatus(500);
            return;
        }
    }

    next();
}