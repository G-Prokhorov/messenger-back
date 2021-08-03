import { Injectable, Param } from '@nestjs/common';

@Injectable()
export class AuthService {
    register():string {
        return "Register"
    }

    login(): string {
        return "Login"
    }

    sendCode(type: string): string {
        return `Send code for ${type}`
    }
}
