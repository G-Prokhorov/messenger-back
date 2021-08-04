import {IsString} from "class-validator";

export class restorePasswordDto {
    @IsString()
    password: string;

    confirm: string;

    @IsString()
    key: string;

    @IsString()
    email: string;
}

export class changePasswordDto {
    _userName_: string;

    @IsString()
    oldPass: string;

    @IsString()
    password: string;

    @IsString()
    confirm: string;
}
