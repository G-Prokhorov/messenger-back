import { Controller, Post, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/register")
    register():string {
        return this.authService.register();
    }

    @Post("/login")
    login():string {
        return this.authService.login();
    }

    @Post("/sendCode/:type")
    sendCode(@Param('type') type:string):string {
        return this.authService.sendCode(type);
    }
}
