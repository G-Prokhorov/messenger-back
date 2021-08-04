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
    @IsString()
    oldPass: string;

    @IsString()
    password: string;

    @IsString()
    confirm: string;

    _userName_: string;
}

export class changeNameDto {
    @IsString()
    name:string;

    _userId_: string;
}
