import {Controller, Post, Param, Body, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import {ValidationPipe} from "../validation.pipe";
import {loginDto, registerDto, sendCodeDto} from "../dto/auth.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/register")
    register(@Body(new ValidationPipe()) registerBody: registerDto, @Res() res) {
        return this.authService.register(registerBody, res);
    }

    @Post("/login")
    login(@Body(new ValidationPipe()) loginBody: loginDto, @Res() res) {
        return this.authService.login(loginBody, res);
    }

    @Post("/sendCode/:type")
    sendCode(@Param('type') type:string, @Body(new ValidationPipe()) sendCodeBody: sendCodeDto, @Res() res) {
        return this.authService.sendCode(type, sendCodeBody, res);
    }
}
