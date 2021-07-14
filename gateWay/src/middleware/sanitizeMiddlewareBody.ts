import sanitizer from "sanitizer";

export default function sanitizeMiddlewareBody(req: any, res: any, next: any) {
    for (let val in req.body) {
        try {
            req.body[val] = sanitizer.escape(req.body[val]);
        } catch {
            res.sendStatus(500);
            return;
        }
    }
    next();
}