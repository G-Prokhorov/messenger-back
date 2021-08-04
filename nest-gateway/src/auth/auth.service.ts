import { Injectable } from '@nestjs/common';
import {loginInterface, registerInterface, sendCodeInterface} from "../interface/auth.interface";

@Injectable()
export class AuthService {
    register(body: registerInterface) {
        return body;
    }

    login(body: loginInterface) {
        return body;
    }

    sendCode(type: string, body: sendCodeInterface): string {
        return `Send code for ${type}, ${body.email}`;
    }
}
