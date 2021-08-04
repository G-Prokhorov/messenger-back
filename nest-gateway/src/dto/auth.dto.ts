import {IsString} from "class-validator";

export class sendCodeDto {
    @IsString()
    email: string
}

export class loginDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}

export class registerDto {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    email: string;

    @IsString()
    confirm: string;

    @IsString()
    key: string;
}