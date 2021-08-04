import {Controller, Post, Param, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import {ValidationPipe} from "../validation.pipe";
import {loginDto, registerDto, sendCodeDto} from "../dto/auth.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/register")
    register(@Body(new ValidationPipe()) registerBody: registerDto) {
        return this.authService.register(registerBody);
    }

    @Post("/login")
    login(@Body(new ValidationPipe()) loginBody: loginDto) {
        return this.authService.login(loginBody);
    }

    @Post("/sendCode/:type")
    sendCode(@Param('type') type:string, @Body(new ValidationPipe()) sendCodeBody: sendCodeDto):string {
        return this.authService.sendCode(type, sendCodeBody);
    }
}
