import {ForbiddenException, Injectable, InternalServerErrorException, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import setToken from '../token/set';
import checkTokens from '../token/checkTokens';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        console.log('Auth middleware');
        let token;
        let refresh;
        try {
            token = req.cookies.token;
            refresh = req.cookies.refreshToken;
        } catch (e) {
            if (!(e instanceof TypeError)) {
                console.error("Error while get tokens front cookie. " + e);
            }
            throw new ForbiddenException();
        }
        if (!token && !refresh) {
            throw new ForbiddenException();
        }

        try {
            let [result, username, userId, name, emailUser] = await checkTokens(token, refresh);
            if (result) {
                setToken(res, result);
            }

            req["user"] = {}
            req["user"]["_userName_"] = username;
            req["user"]["_userId_"] = userId;
            req["user"]["_u_name_"] = name;
            req["user"]["_emailUser_"] = emailUser;
            next();
        } catch (e) {
            switch (e.message) {
                case "User not exist":
                    throw new ForbiddenException();
                case "Token isn't valid":
                    throw new ForbiddenException();
                default:
                    throw new InternalServerErrorException();
            }
        }
    }
}