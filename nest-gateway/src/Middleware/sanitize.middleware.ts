import {InternalServerErrorException} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as sanitizer from "sanitizer";

export function sanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
        let res1 = sanitizeObj(req.cookies);
        let res2 = sanitizeObj(req.query);
        if (!res1 || !res2) {
            throw new InternalServerErrorException();
        }
        next();
    }

function sanitizeObj(obj):boolean {
    for (let val in obj) {
        try {
            obj[val] = sanitizer.escape(obj[val]);
        } catch (e) {
            console.error("Error while sanitize. " + e)
            return false;
        }
    }

    return true;
}
